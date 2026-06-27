 import { Controller, Post, Body } from '@midwayjs/core';
 import { Inject } from '@midwayjs/core';
 import { UserService } from '../service/user.service';
 
 @Controller('/api/auth')
 export class AuthController {
   @Inject()
   userService: UserService;
 
   @Post('/register')
   async register(@Body() body: { phone: string; password: string }) {
     try {
       const user = await this.userService.registerByPhone(body.phone, body.password);
       return { code: 0, message: '注册成功', data: { id: user.id } };
     } catch (err: any) {
       return { code: 1, message: err.message };
     }
   }
 
   @Post('/login')
   async login(@Body() body: { phone: string; password: string }) {
     try {
       const result = await this.userService.loginByPhone(body.phone, body.password);
       return { code: 0, message: '登录成功', data: result };
     } catch (err: any) {
       return { code: 1, message: err.message };
     }
   }
 }
