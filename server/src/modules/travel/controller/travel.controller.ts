import { Controller, Get, Post, Put, Body, Param, Query, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TravelService } from '../service/travel.service';

@Controller('/api')
export class TravelController {
  @Inject()
  travelService: TravelService;

  @Inject()
  ctx: Context;

  // ==================== 景区 ====================

  @Get('/scenic-spots')
  async listScenicSpots(@Query('keyword') keyword?: string) {
    try {
      const data = await this.travelService.listScenicSpots(keyword);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/scenic-spots/:id')
  async getScenicSpot(@Param('id') id: number) {
    try {
      const data = await this.travelService.getScenicSpot(id);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 门票 ====================

  @Get('/scenic-spots/:id/tickets')
  async getTicketTypes(@Param('id') id: number) {
    try {
      const data = await this.travelService.getTicketTypes(id);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 路线套餐 ====================

  @Get('/routes')
  async listRoutes(@Query('duration') duration?: string) {
    try {
      const data = await this.travelService.listRoutes(duration);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/routes/:id')
  async getRoute(@Param('id') id: number) {
    try {
      const data = await this.travelService.getRoute(id);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/routes/:id/schedules')
  async getRouteSchedules(@Param('id') id: number) {
    try {
      const data = await this.travelService.getRouteSchedules(id);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 交通攻略 ====================

  @Get('/transport-guides')
  async listTransportGuides(
    @Query('departure') departure?: string,
    @Query('destination') destination?: string
  ) {
    try {
      const data = await this.travelService.listTransportGuides(departure, destination);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/transport-guides/:id')
  async getTransportGuide(@Param('id') id: number) {
    try {
      const data = await this.travelService.getTransportGuide(id);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 订单 ====================

  @Post('/travel/orders')
  async createOrder(@Body() body: any) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };

      const data = await this.travelService.createOrder({
        userId: user.userId,
        merchantId: body.merchantId || 1,
        orderType: body.orderType,
        items: body.items,
        totalAmount: body.totalAmount,
        visitorNames: body.visitorNames,
        visitorIds: body.visitorIds,
        travelDate: body.travelDate,
        remark: body.remark,
      });
      return { code: 0, message: '下单成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/travel/orders')
  async listMyOrders(@Query('status') status?: number) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const data = await this.travelService.listMyOrders(user.userId, status);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/travel/orders/:id')
  async getOrderDetail(@Param('id') id: number) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const data = await this.travelService.getOrderDetail(id, user.userId);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Post('/travel/orders/:id/cancel')
  async cancelOrder(@Param('id') id: number) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const data = await this.travelService.cancelOrder(id, user.userId);
      return { code: 0, message: '取消成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 电子票 ====================

  @Get('/e-tickets')
  async listMyETickets(@Query('status') status?: number) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const data = await this.travelService.listMyETickets(user.userId, status);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/e-tickets/:id')
  async getETicket(@Param('id') id: number) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const data = await this.travelService.getETicket(id, user.userId);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Post('/e-tickets/verify')
  async verifyETicket(@Body() body: { qrCode: string }) {
    try {
      const data = await this.travelService.verifyETicket(body.qrCode, 1);
      return { code: 0, message: '核销成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 评价 ====================

  @Get('/travel/reviews')
  async listReviews(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: number
  ) {
    try {
      const data = await this.travelService.listReviews(targetType, targetId);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Post('/travel/reviews')
  async createReview(@Body() body: any) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const data = await this.travelService.createReview({
        orderId: body.orderId,
        targetId: body.targetId,
        targetType: body.targetType,
        userId: user.userId,
        rating: body.rating,
        content: body.content,
        images: body.images,
      });
      return { code: 0, message: '评价成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }
}
