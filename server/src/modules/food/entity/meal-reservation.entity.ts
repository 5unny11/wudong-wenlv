 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('meal_reservation')
 export class MealReservationEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) restaurant_id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'bigint', unsigned: true }) order_id: number;
   @Column({ type: 'date' }) reserve_date: string;
   @Column({ length: 16 }) time_slot: string;
   @Column({ type: 'int', default: 1 }) guest_count: number;
   @Column({ length: 64, nullable: true }) guest_name: string;
   @Column({ length: 20, nullable: true }) guest_phone: string;
   @Column({ type: 'tinyint', default: 0 }) status: number; // 0待确认 1已确认 2已完成 3已取消
   @CreateDateColumn() created_at: Date;
 }
