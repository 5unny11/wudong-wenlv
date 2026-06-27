import { Controller, Get, Put, Body, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Get('/profile')
  async getProfile() {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const detail = await this.userService.getUserById(user.userId);
      if (!detail) return { code: 401, message: '用户不存在' };
      return { code: 0, message: 'success', data: { id: detail.id, nickname: detail.nickname, phone: detail.phone, is_merchant: detail.is_merchant } };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }

  @Put('/profile')
  async updateProfile(@Body() body: { nickname: string }) {
    try {
      const user = this.ctx.state.user;
      if (!user) return { code: 401, message: '请先登录' };
      const updated = await this.userService.updateProfile(user.userId, body);
      return { code: 0, message: '修改成功', data: updated };
    } catch (err: any) {
      return { code: 1, message: err.message };
    }
  }
}
