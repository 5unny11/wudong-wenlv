 import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 @Entity('menu_item')
 export class MenuItemEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) restaurant_id: number;
   @Column({ length: 128 }) name: string;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
   @Column({ length: 256, nullable: true }) image: string;
   @Column({ length: 256, nullable: true }) desc: string;
 }
