 import { Middleware } from '@midwayjs/core';
 import { Context, NextFunction } from '@midwayjs/koa';
 
 @Middleware()
 export class ReportMiddleware {
   resolve() {
     return async (ctx: Context, next: NextFunction) => {
       const start = Date.now();
       await next();
       const ms = Date.now() - start;
       console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
     };
   }
 }
