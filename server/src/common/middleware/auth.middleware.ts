 import { Middleware } from '@midwayjs/core';
 import { Context, NextFunction } from '@midwayjs/koa';
 import * as jwt from 'jsonwebtoken';
 
 const JWT_SECRET = 'wudong_wenlv_jwt_secret_key_2026';
 const WHITE_LIST = [
  '/api/auth/',
  '/api/scenic-spots',
  '/api/routes',
  '/api/transport-guides',
  '/api/travel/reviews',
  '/swagger-ui/',
  '/api-docs/',
];
 
 @Middleware()
 export class AuthMiddleware {
   resolve() {
     return async (ctx: Context, next: NextFunction) => {
       if (WHITE_LIST.some(r => ctx.path.startsWith(r))) return next();
       const auth = ctx.headers['authorization'] as string;
       if (!auth) { ctx.status = 401; ctx.body = { code: 401, message: '请先登录' }; return; }
       try {
         const user = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
         ctx.state.user = user;
       } catch {
         ctx.status = 401; ctx.body = { code: 401, message: '登录已过期' }; return;
       }
       return next();
     };
   }
 }
