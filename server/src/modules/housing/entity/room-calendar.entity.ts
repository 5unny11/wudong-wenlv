 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('room_calendar')
 export class RoomCalendarEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) room_type_id: number;
   @Column({ type: 'date' }) date: string;
   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) price: number;
   @Column({ type: 'int', default: 0 }) available: number;
   @Column({ type: 'int', default: 0 }) booked: number;
   @Column({ type: 'tinyint', default: 1 }) status: number; // 1可订 0不可订
   @CreateDateColumn() created_at: Date;
 }
