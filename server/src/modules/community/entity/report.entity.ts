 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('report')
 export class ReportEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 16 }) target_type: string;
   @Column({ type: 'bigint', unsigned: true }) target_id: number;
   @Column({ length: 256 }) reason: string;
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0待处理 1已处理 2已驳回
   @CreateDateColumn() created_at: Date;
 }
