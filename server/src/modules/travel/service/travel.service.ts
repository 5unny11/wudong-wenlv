import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { ScenicSpotEntity } from '../entity/scenic-spot.entity';
import { TicketTypeEntity } from '../entity/ticket-type.entity';
import { TourRouteEntity } from '../entity/tour-route.entity';
import { RouteScheduleEntity } from '../entity/route-schedule.entity';
import { ETicketEntity } from '../entity/e-ticket.entity';
import { TransportGuideEntity } from '../entity/transport-guide.entity';
import { TravelReviewEntity } from '../entity/travel-review.entity';
import { OrderEntity } from '../../../common/entity/order.entity';
@Provide()
export class TravelService {
  @InjectEntityModel(ScenicSpotEntity)
  scenicSpotModel: Repository<ScenicSpotEntity>;

  @InjectEntityModel(TicketTypeEntity)
  ticketTypeModel: Repository<TicketTypeEntity>;

  @InjectEntityModel(TourRouteEntity)
  tourRouteModel: Repository<TourRouteEntity>;

  @InjectEntityModel(RouteScheduleEntity)
  routeScheduleModel: Repository<RouteScheduleEntity>;

  @InjectEntityModel(ETicketEntity)
  eTicketModel: Repository<ETicketEntity>;

  @InjectEntityModel(TransportGuideEntity)
  transportGuideModel: Repository<TransportGuideEntity>;

  @InjectEntityModel(TravelReviewEntity)
  travelReviewModel: Repository<TravelReviewEntity>;

  @InjectEntityModel(OrderEntity)
  orderModel: Repository<OrderEntity>;

  // ==================== 景区 ====================

  async listScenicSpots(keyword?: string) {
    const where: any = { status: 1 };
    if (keyword) where.name = Like(`%${keyword}%`);
    const spots = await this.scenicSpotModel.find({ where, order: { id: 'ASC' } });
    return await this.attachRatings(spots, 'scenic_spot');
  }

  async getScenicSpot(id: number) {
    const spot = await this.scenicSpotModel.findOne({ where: { id } });
    if (!spot) throw new Error('景区不存在');
    const tickets = await this.ticketTypeModel.find({ where: { scenic_spot_id: id } });
    return { ...spot, tickets };
  }

  // ==================== 门票 ====================

  async getTicketTypes(scenicSpotId: number) {
    return await this.ticketTypeModel.find({ where: { scenic_spot_id: scenicSpotId } });
  }

  // ==================== 路线套餐 ====================

  async listRoutes(duration?: string) {
    const where: any = { status: 1 };
    if (duration) where.duration = duration;
    const routes = await this.tourRouteModel.find({ where, order: { id: 'ASC' } });
    return await this.attachRatings(routes, 'tour_route');
  }

  async getRoute(id: number) {
    const route = await this.tourRouteModel.findOne({ where: { id, status: 1 } });
    if (!route) throw new Error('路线不存在');
    const schedules = await this.routeScheduleModel.find({
      where: { route_id: id },
      order: { day_number: 'ASC' },
    });
    return { ...route, schedules };
  }

  async getRouteSchedules(routeId: number) {
    return await this.routeScheduleModel.find({
      where: { route_id: routeId },
      order: { day_number: 'ASC' },
    });
  }

  // ==================== 交通攻略 ====================

  async listTransportGuides(departure?: string, destination?: string) {
    const where: any = { status: 1 };
    if (departure) where.departure = Like(`%${departure}%`);
    if (destination) where.destination = Like(`%${destination}%`);
    return await this.transportGuideModel.find({ where, order: { id: 'ASC' } });
  }

  async getTransportGuide(id: number) {
    const guide = await this.transportGuideModel.findOne({ where: { id, status: 1 } });
    if (!guide) throw new Error('交通攻略不存在');
    return guide;
  }

  // ==================== 订单（线路订票专用） ====================

  async createOrder(params: {
    userId: number;
    merchantId: number;
    orderType: 'ticket' | 'route';
    items: Array<{ ticketTypeId?: number; routeId?: number; quantity: number; price: number }>;
    totalAmount: number;
    visitorNames?: string[];
    visitorIds?: string[];
    travelDate: string;
    remark?: string;
  }) {
    const orderNo = 'TL' + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase();

    const order = this.orderModel.create({
      order_no: orderNo,
      user_id: params.userId,
      merchant_id: params.merchantId,
      order_type: params.orderType,
      status: 0,
      total_amount: params.totalAmount,
      pay_amount: params.totalAmount,
      travel_date: params.travelDate,
      visitor_info: { names: params.visitorNames || [], ids: params.visitorIds || [] },
      remark: params.remark,
    });

    const saved = await this.orderModel.save(order);

    // 生成电子票
    for (const item of params.items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticketTypeId = item.ticketTypeId || 0;
        const routeId = item.routeId || 0;

        const et = this.eTicketModel.create({
          order_id: saved.id,
          ticket_type_id: ticketTypeId || routeId,
          qr_code: 'TKT' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase(),
          valid_from: params.travelDate,
          valid_to: this.calcValidTo(params.travelDate, 30),
          status: 0,
        });
        await this.eTicketModel.save(et);
      }
    }

    return saved;
  }

  async listMyOrders(userId: number, status?: number) {
    const where: any = { user_id: userId };
    if (status !== undefined) where.status = status;
    return await this.orderModel.find({ where, order: { created_at: 'DESC' } });
  }

  async getOrderDetail(orderId: number, userId: number) {
    const order = await this.orderModel.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new Error('订单不存在');
    const tickets = await this.eTicketModel.find({ where: { order_id: orderId } });

    // 推导评价目标
    let reviewTarget: { targetType: string; targetId: number } | null = null;
    if (tickets.length > 0) {
      const firstTicket = tickets[0];
      if (order.order_type === 'ticket') {
        const ticketType = await this.ticketTypeModel.findOne({ where: { id: firstTicket.ticket_type_id } });
        if (ticketType) reviewTarget = { targetType: 'scenic_spot', targetId: ticketType.scenic_spot_id };
      } else if (order.order_type === 'route') {
        reviewTarget = { targetType: 'tour_route', targetId: firstTicket.ticket_type_id };
      }
    }

    return { ...order, tickets, reviewTarget };
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.orderModel.findOne({ where: { id: orderId, user_id: userId, status: 0 } });
    if (!order) throw new Error('订单不存在或无法取消');
    order.status = 4;
    order.completed_at = new Date();
    await this.orderModel.save(order);

    // 电子票标记为已退款
    await this.eTicketModel.update({ order_id: orderId, status: 0 }, { status: 2 });
    return order;
  }

  async payOrder(orderId: number, userId: number) {
    const order = await this.orderModel.findOne({ where: { id: orderId, user_id: userId, status: 0 } });
    if (!order) throw new Error('订单不存在或无法支付');
    order.status = 1;
    order.paid_at = new Date();
    await this.orderModel.save(order);
    // 电子票状态保持 0（未使用），等待后续核销
    return order;
  }

  // ==================== 电子票 ====================

  async listMyETickets(userId: number, status?: number) {
    // 先查用户的所有订单
    const orders = await this.orderModel.find({ where: { user_id: userId }, select: ['id'] });
    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) return [];

    const where: any = {
      order_id: orderIds.length === 1 ? orderIds[0] : In(orderIds),
    };
    if (status !== undefined) where.status = status;

    return await this.eTicketModel.find({ where, order: { created_at: 'DESC' } });
  }

  async getETicket(id: number, userId: number) {
    const ticket = await this.eTicketModel.findOne({ where: { id } });
    if (!ticket) throw new Error('电子票不存在');

    const order = await this.orderModel.findOne({ where: { id: ticket.order_id, user_id: userId } });
    if (!order) throw new Error('无权查看此电子票');

    return { ...ticket, order };
  }

  async verifyETicket(code: string, adminUserId: number) {
    const ticket = await this.eTicketModel.findOne({ where: { qr_code: code, status: 0 } });
    if (!ticket) throw new Error('电子票无效或已使用');

    ticket.status = 1;
    ticket.used_at = new Date();
    await this.eTicketModel.save(ticket);
    return { success: true, message: '核销成功', ticket };
  }

  // ==================== 评价 ====================

  async listReviews(targetType: string, targetId: number) {
    return await this.travelReviewModel.find({
      where: { target_type: targetType, target_id: targetId },
      order: { created_at: 'DESC' },
    });
  }

  async createReview(params: {
    orderId: number;
    targetId: number;
    targetType: string;
    userId: number;
    rating: number;
    content?: string;
    images?: string[];
  }) {
    // 只有已支付的订单才能评价
    const order = await this.orderModel.findOne({ where: { id: params.orderId, user_id: params.userId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== 1) throw new Error('订单未支付，无法评价');

    const review = this.travelReviewModel.create({
      order_id: params.orderId,
      target_id: params.targetId,
      target_type: params.targetType,
      user_id: params.userId,
      rating: params.rating,
      content: params.content,
      images: params.images,
    });
    await this.travelReviewModel.save(review);

    // 更新订单状态为已完成
    await this.orderModel.update({ id: params.orderId }, { status: 3, completed_at: new Date() });

    return review;
  }

  // ==================== 管理后台：统计 ====================

  async adminStats() {
    // 只统计已支付订单下的未核销票
    const paidOrders = await this.orderModel.find({ where: { status: 1 }, select: ['id'] });
    const paidOrderIds = paidOrders.map(o => o.id);
    const [orders, spots, routes, tickets] = await Promise.all([
      this.orderModel.count(),
      this.scenicSpotModel.count({ where: { status: 1 } }),
      this.tourRouteModel.count({ where: { status: 1 } }),
      paidOrderIds.length > 0
        ? this.eTicketModel.count({ where: { order_id: In(paidOrderIds), status: 0 } })
        : Promise.resolve(0),
    ]);
    return { orders, spots, routes, tickets };
  }

  // ==================== 管理后台：景区 CRUD ====================

  async adminListScenicSpots(keyword?: string) {
    const where: any = {};
    if (keyword) where.name = Like(`%${keyword}%`);
    const spots = await this.scenicSpotModel.find({ where, order: { id: 'DESC' } });
    // 附带每个景区的票种和评分
    const withRatings = await this.attachRatings(spots, 'scenic_spot');
    const result = [];
    for (const spot of withRatings) {
      const tickets = await this.ticketTypeModel.find({ where: { scenic_spot_id: spot.id } });
      result.push({ ...spot, tickets });
    }
    return result;
  }

  async adminCreateScenicSpot(params: { name: string; address?: string; open_time?: string; intro?: string; main_image?: string }) {
    const spot = this.scenicSpotModel.create(params);
    return await this.scenicSpotModel.save(spot);
  }

  async adminUpdateScenicSpot(id: number, params: any) {
    const spot = await this.scenicSpotModel.findOne({ where: { id } });
    if (!spot) throw new Error('景区不存在');
    Object.assign(spot, params);
    return await this.scenicSpotModel.save(spot);
  }

  async adminDeleteScenicSpot(id: number) {
    return await this.scenicSpotModel.update({ id }, { status: 0 });
  }

  // ==================== 管理后台：票种 CRUD ====================

  async adminCreateTicketType(params: { scenic_spot_id: number; name: string; price: number; stock?: number; valid_days?: number }) {
    const ticket = this.ticketTypeModel.create(params);
    return await this.ticketTypeModel.save(ticket);
  }

  async adminUpdateTicketType(id: number, params: any) {
    const ticket = await this.ticketTypeModel.findOne({ where: { id } });
    if (!ticket) throw new Error('票种不存在');
    Object.assign(ticket, params);
    return await this.ticketTypeModel.save(ticket);
  }

  async adminDeleteTicketType(id: number) {
    return await this.ticketTypeModel.delete({ id });
  }

  // ==================== 管理后台：路线 CRUD ====================

  async adminListRoutes() {
    const routes = await this.tourRouteModel.find({ order: { id: 'DESC' } });
    const withRatings = await this.attachRatings(routes, 'tour_route');
    const result = [];
    for (const route of withRatings) {
      const schedules = await this.routeScheduleModel.find({
        where: { route_id: route.id },
        order: { day_number: 'ASC' },
      });
      result.push({ ...route, schedules });
    }
    return result;
  }

  async adminCreateRoute(params: any) {
    const route = this.tourRouteModel.create(params);
    return await this.tourRouteModel.save(route);
  }

  async adminUpdateRoute(id: number, params: any) {
    const route = await this.tourRouteModel.findOne({ where: { id } });
    if (!route) throw new Error('路线不存在');
    Object.assign(route, params);
    return await this.tourRouteModel.save(route);
  }

  async adminDeleteRoute(id: number) {
    return await this.tourRouteModel.update({ id }, { status: 0 });
  }

  // ==================== 管理后台：行程 CRUD ====================

  async adminCreateRouteSchedule(params: any) {
    const schedule = this.routeScheduleModel.create(params);
    return await this.routeScheduleModel.save(schedule);
  }

  async adminUpdateRouteSchedule(id: number, params: any) {
    const schedule = await this.routeScheduleModel.findOne({ where: { id } });
    if (!schedule) throw new Error('行程不存在');
    Object.assign(schedule, params);
    return await this.routeScheduleModel.save(schedule);
  }

  async adminDeleteRouteSchedule(id: number) {
    return await this.routeScheduleModel.delete({ id });
  }

  // ==================== 管理后台：订单 ====================

  async adminListOrders(params: { status?: number; orderType?: string; page?: number; pageSize?: number }) {
    const where: any = {};
    if (params.status !== undefined) where.status = params.status;
    if (params.orderType) where.order_type = params.orderType;
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const [list, total] = await this.orderModel.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async adminGetOrderDetail(orderId: number) {
    const order = await this.orderModel.findOne({ where: { id: orderId } });
    if (!order) throw new Error('订单不存在');
    const tickets = await this.eTicketModel.find({ where: { order_id: orderId } });
    return { ...order, tickets };
  }

  // ==================== 管理后台：交通攻略 CRUD ====================

  async adminListTransportGuides() {
    return await this.transportGuideModel.find({ order: { id: 'DESC' } });
  }

  async adminCreateTransportGuide(params: any) {
    const guide = this.transportGuideModel.create(params);
    return await this.transportGuideModel.save(guide);
  }

  async adminUpdateTransportGuide(id: number, params: any) {
    const guide = await this.transportGuideModel.findOne({ where: { id } });
    if (!guide) throw new Error('交通攻略不存在');
    Object.assign(guide, params);
    return await this.transportGuideModel.save(guide);
  }

  async adminDeleteTransportGuide(id: number) {
    return await this.transportGuideModel.update({ id }, { status: 0 });
  }

  // ==================== 管理后台：评价管理 ====================

  async adminListReviews(targetType?: string, page = 1, pageSize = 20) {
    const where: any = {};
    if (targetType) where.target_type = targetType;
    const [list, total] = await this.travelReviewModel.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async adminDeleteReview(id: number) {
    return await this.travelReviewModel.delete({ id });
  }

  // ==================== 工具方法 ====================

  private async attachRatings(items: any[], targetType: string): Promise<any[]> {
    const ids = items.map(i => i.id);
    if (ids.length === 0) return items;
    const reviews = await this.travelReviewModel.find({ where: { target_type: targetType, target_id: In(ids) } });
    const grouped: Record<number, number[]> = {};
    for (const r of reviews) {
      if (!grouped[r.target_id]) grouped[r.target_id] = [];
      grouped[r.target_id].push(r.rating);
    }
    return items.map(item => {
      const ratings = grouped[item.id] || [];
      const avg = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;
      return { ...item, avgRating: Math.round(avg * 10) / 10, reviewCount: ratings.length };
    });
  }

  private calcValidTo(fromDate: string, days: number): string {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }
}
