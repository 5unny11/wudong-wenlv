import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class AdminMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const user = ctx.state.user;
      if (!user || user.role !== 'admin') {
        ctx.status = 403;
        ctx.body = { code: 403, message: '无权限，仅管理员可操作' };
        return;
      }
      return next();
    };
  }
}
