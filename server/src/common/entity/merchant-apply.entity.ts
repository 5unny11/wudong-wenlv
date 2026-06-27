 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('merchant_apply')
 export class MerchantApplyEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 128 }) shop_name: string;
   @Column({ length: 16 }) module: string;
   @Column({ type: 'simple-json', nullable: true }) credentials: string[];
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0待审核 1通过 2驳回
   @Column({ length: 256, nullable: true }) reject_reason: string;
   @Column({ type: 'bigint', unsigned: true, nullable: true }) reviewer_id: number;
   @Column({ type: 'datetime', nullable: true }) review_time: Date;
   @CreateDateColumn() created_at: Date;
 }
