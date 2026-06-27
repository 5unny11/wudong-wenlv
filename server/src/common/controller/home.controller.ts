 import { Controller, Get } from '@midwayjs/core';
 
 @Controller('/')
 export class HomeController {
   @Get('/')
   async home() {
     return {
       name: '乌东文旅平台',
       version: '1.0.0',
       docs: '/swagger-ui/',
     };
   }
 }
