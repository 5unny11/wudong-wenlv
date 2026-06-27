 import { Provide, Inject } from '@midwayjs/core';
 import { InjectEntityModel } from '@midwayjs/typeorm';
 import { Repository } from 'typeorm';
 import { JwtService } from '@midwayjs/jwt';
 import * as bcrypt from 'bcryptjs';
 import { UserEntity } from '../entity/user.entity';
 
 @Provide()
 export class UserService {
   @InjectEntityModel(UserEntity)
   userModel: Repository<UserEntity>;
 
   @Inject()
   jwtService: JwtService;
 
   /**
    * 手机号注册
    */
   async registerByPhone(phone: string, password: string) {
     const existing = await this.userModel.findOne({ where: { phone } });
     if (existing) {
       throw new Error('该手机号已注册');
     }
     const hash = await bcrypt.hash(password, 10);
     const user = this.userModel.create({ phone, password_hash: hash, nickname: '游客' });
     return await this.userModel.save(user);
   }
 
   /**
    * 密码登录
    */
   async loginByPhone(phone: string, password: string) {
     const user = await this.userModel.findOne({ where: { phone, status: 1 } });
     if (!user || !user.password_hash) {
       throw new Error('账号或密码错误');
     }
     const valid = await bcrypt.compare(password, user.password_hash);
     if (!valid) {
       throw new Error('账号或密码错误');
     }
     await this.userModel.update({ id: user.id }, { last_login_at: new Date() });
     const token = await this.jwtService.sign({
       userId: user.id,
       role: user.is_merchant ? 'admin' : 'user',
     });
     return { token, user };
   }
 
   /**
    * 验证 Token
    */
   async verifyToken(token: string) {
     return await this.jwtService.verify(token);
   }
 
   async getUserById(id: number) {
     return await this.userModel.findOne({ where: { id } });
   }
 }
