 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('order')
 export class OrderEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 32, unique: true }) order_no: string;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'bigint', unsigned: true, nullable: true }) merchant_id: number;
   @Column({ length: 16 }) order_type: string; // product / meal / housing / ticket / route
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0待支付 1已支付 2已发货 3已完成 4已取消 5退款中 6已退款
   @Column({ type: 'decimal', precision: 10, scale: 2 }) total_amount: number;
   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) discount_amount: number;
   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) freight: number;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) pay_amount: number;
   @Column({ length: 64, nullable: true }) logistics_company: string;
   @Column({ length: 64, nullable: true }) logistics_no: string;
   @Column({ type: 'date', nullable: true }) travel_date: string;
   @Column({ type: 'simple-json', nullable: true }) visitor_info: { names: string[]; ids: string[] };
   @Column({ type: 'text', nullable: true }) remark: string;
   @Column({ type: 'datetime', nullable: true }) paid_at: Date;
   @Column({ type: 'datetime', nullable: true }) shipped_at: Date;
   @Column({ type: 'datetime', nullable: true }) completed_at: Date;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
