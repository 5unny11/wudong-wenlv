 import { Configuration, App } from '@midwayjs/core';
 import * as koa from '@midwayjs/koa';
 import * as jwt from '@midwayjs/jwt';
 import * as typeorm from '@midwayjs/typeorm';
 import { ReportMiddleware } from './common/middleware/report.middleware';
 import { AuthMiddleware } from './common/middleware/auth.middleware';
 import { join } from 'path';

 @Configuration({
   imports: [koa, jwt, typeorm],
   importConfigs: [join(__dirname, './config')],
 })
 export class MainConfiguration {
   @App('koa')
   app: koa.Application;
   async onReady() {
     this.app.useMiddleware([ReportMiddleware, AuthMiddleware]);
   }
 }
