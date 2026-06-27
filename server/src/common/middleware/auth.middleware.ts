 import { Middleware, Config } from '@midwayjs/core';
 import { Context, NextFunction } from '@midwayjs/koa';
 import { JwtService } from '@midwayjs/jwt';

 const WHITE_LIST = [
  '/api/auth/',
  '/api/scenic-spots',
  '/api/routes',
  '/api/transport-guides',
  '/swagger-ui/',
  '/api-docs/',
];

// GET 请求且路径精确匹配以下前缀的免登录
const GET_WHITE_LIST = [
  '/api/travel/reviews',
];
 
 @Middleware()
 export class AuthMiddleware {
   @Config('jwt.secret')
   jwtSecret: string;

   resolve() {
     return async (ctx: Context, next: NextFunction) => {
       if (ctx.path === '/' || WHITE_LIST.some(r => ctx.path.startsWith(r))) return next();
       if (ctx.method === 'GET' && GET_WHITE_LIST.some(r => ctx.path.startsWith(r))) return next();
       const auth = ctx.headers['authorization'] as string;
       if (!auth) { ctx.status = 401; ctx.body = { code: 401, message: '请先登录' }; return; }
       try {
         const jwt = await ctx.requestContext.getAsync(JwtService);
         const user = await jwt.verify(auth.replace('Bearer ', ''));
         ctx.state.user = user;
       } catch {
         ctx.status = 401; ctx.body = { code: 401, message: '登录已过期' }; return;
       }
       return next();
     };
   }
 }
