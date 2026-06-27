import { Controller, Get, Post, Put, Del, Body, Param, Query, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TravelService } from '../service/travel.service';
import { AdminMiddleware } from '../../../common/middleware/admin.middleware';

@Controller('/api/admin/travel', { middleware: [AdminMiddleware] })
export class AdminTravelController {
  @Inject()
  travelService: TravelService;

  @Inject()
  ctx: Context;

  // ==================== 景区管理 ====================

  @Get('/scenic-spots')
  async listScenicSpots(@Query('keyword') keyword?: string) {
    try {
      const data = await this.travelService.adminListScenicSpots(keyword);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Post('/scenic-spots')
  async createScenicSpot(@Body() body: any) {
    try {
      const data = await this.travelService.adminCreateScenicSpot(body);
      return { code: 0, message: '创建成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Put('/scenic-spots/:id')
  async updateScenicSpot(@Param('id') id: number, @Body() body: any) {
    try {
      const data = await this.travelService.adminUpdateScenicSpot(id, body);
      return { code: 0, message: '更新成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Del('/scenic-spots/:id')
  async deleteScenicSpot(@Param('id') id: number) {
    try {
      await this.travelService.adminDeleteScenicSpot(id);
      return { code: 0, message: '已下架' };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 票种管理 ====================

  @Post('/ticket-types')
  async createTicketType(@Body() body: any) {
    try {
      const data = await this.travelService.adminCreateTicketType(body);
      return { code: 0, message: '创建成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Put('/ticket-types/:id')
  async updateTicketType(@Param('id') id: number, @Body() body: any) {
    try {
      const data = await this.travelService.adminUpdateTicketType(id, body);
      return { code: 0, message: '更新成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Del('/ticket-types/:id')
  async deleteTicketType(@Param('id') id: number) {
    try {
      await this.travelService.adminDeleteTicketType(id);
      return { code: 0, message: '已删除' };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 路线管理 ====================

  @Get('/routes')
  async listRoutes() {
    try {
      const data = await this.travelService.adminListRoutes();
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Post('/routes')
  async createRoute(@Body() body: any) {
    try {
      const data = await this.travelService.adminCreateRoute(body);
      return { code: 0, message: '创建成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Put('/routes/:id')
  async updateRoute(@Param('id') id: number, @Body() body: any) {
    try {
      const data = await this.travelService.adminUpdateRoute(id, body);
      return { code: 0, message: '更新成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Del('/routes/:id')
  async deleteRoute(@Param('id') id: number) {
    try {
      await this.travelService.adminDeleteRoute(id);
      return { code: 0, message: '已下架' };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 行程管理 ====================

  @Post('/route-schedules')
  async createRouteSchedule(@Body() body: any) {
    try {
      const data = await this.travelService.adminCreateRouteSchedule(body);
      return { code: 0, message: '创建成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Put('/route-schedules/:id')
  async updateRouteSchedule(@Param('id') id: number, @Body() body: any) {
    try {
      const data = await this.travelService.adminUpdateRouteSchedule(id, body);
      return { code: 0, message: '更新成功', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Del('/route-schedules/:id')
  async deleteRouteSchedule(@Param('id') id: number) {
    try {
      await this.travelService.adminDeleteRouteSchedule(id);
      return { code: 0, message: '已删除' };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  // ==================== 订单管理 ====================

  @Get('/orders')
  async listOrders(
    @Query('status') status?: string,
    @Query('orderType') orderType?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    try {
      const data = await this.travelService.adminListOrders({
        status: status !== undefined ? Number(status) : undefined,
        orderType,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      });
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Get('/orders/:id')
  async getOrderDetail(@Param('id') id: number) {
    try {
      const data = await this.travelService.adminGetOrderDetail(id);
      return { code: 0, message: 'success', data };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }
}
