 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 
 @Entity('user')
 export class UserEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
   id: number;
 
   @Column({ length: 20, unique: true, nullable: true })
   phone: string;
 
   @Column({ length: 128, nullable: true })
   password_hash: string;
 
   @Column({ length: 64, unique: true, nullable: true })
   wx_openid: string;
 
   @Column({ length: 64, default: '游客' })
   nickname: string;
 
   @Column({ length: 512, nullable: true })
   avatar: string;
 
   @Column({ type: 'tinyint', default: 0 })
   gender: number; // 0未知 1男 2女
 
   @Column({ length: 64, nullable: true })
   region: string;
 
   @Column({ length: 256, nullable: true })
   intro: string;
 
   @Column({ type: 'tinyint', default: 1 })
   status: number; // 1正常 2禁用 3已删除
 
   @Column({ type: 'tinyint', default: 0 })
   is_merchant: number; // 0否 1是（已入驻商家）
 
   @CreateDateColumn()
   created_at: Date;
 
   @UpdateDateColumn()
   updated_at: Date;
 
   @Column({ type: 'datetime', nullable: true })
   last_login_at: Date;
 }
