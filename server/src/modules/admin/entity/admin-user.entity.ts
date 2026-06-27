 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('admin_user')
 export class AdminUserEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 64, unique: true }) username: string;
   @Column({ length: 128 }) password_hash: string;
   @Column({ length: 32 }) real_name: string;
   @Column({ length: 20, nullable: true }) phone: string;
   @Column({ type: 'bigint', unsigned: true, default: 1 }) role_id: number;
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @Column({ type: 'datetime', nullable: true }) last_login_at: Date;
   @CreateDateColumn() created_at: Date;
 }
