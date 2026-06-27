 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('refund_record')
 export class RefundRecordEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) order_id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
   @Column({ length: 256 }) reason: string;
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0申请中 1同意 2驳回
   @Column({ length: 256, nullable: true }) reject_reason: string;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
