 import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 @Entity('room_type')
 export class RoomTypeEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) homestay_id: number;
   @Column({ length: 64 }) name: string;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) base_price: number;
   @Column({ type: 'int', default: 1 }) capacity: number;
   @Column({ type: 'int', default: 1 }) stock: number;
   @Column({ length: 512, nullable: true }) image: string;
   @Column({ type: 'text', nullable: true }) intro: string;
 }
