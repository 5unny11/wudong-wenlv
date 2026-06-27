 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('financial_record')
 export class FinancialRecordEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) order_id: number;
   @Column({ type: 'bigint', unsigned: true }) merchant_id: number;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) order_amount: number;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) commission: number;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) merchant_income: number;
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0待结算 1已结算
   @CreateDateColumn() created_at: Date;
 }
