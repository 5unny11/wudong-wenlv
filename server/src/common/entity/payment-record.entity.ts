 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('payment_record')
 export class PaymentRecordEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) order_id: number;
   @Column({ length: 64, nullable: true }) transaction_id: string;
   @Column({ length: 16 }) payment_method: string; // wxpay
   @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0待支付 1成功 2失败 3退款
   @Column({ type: 'text', nullable: true }) raw_data: string;
   @CreateDateColumn() created_at: Date;
 }
