 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('e_ticket')
 export class ETicketEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) order_id: number;
   @Column({ type: 'bigint', unsigned: true }) ticket_type_id: number;
   @Column({ length: 128 }) qr_code: string;
   @Column({ type: 'date' }) valid_from: string;
   @Column({ type: 'date' }) valid_to: string;
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0未使用 1已使用 2已退款
   @Column({ type: 'datetime', nullable: true }) used_at: Date;
   @CreateDateColumn() created_at: Date;
 }
