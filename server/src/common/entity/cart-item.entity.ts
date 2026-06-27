 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('cart_item')
 export class CartItemEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'bigint', unsigned: true }) merchant_id: number;
   @Column({ length: 16 }) item_type: string; // product / farm_product
   @Column({ type: 'bigint', unsigned: true }) item_id: number;
   @Column({ type: 'bigint', unsigned: true, nullable: true }) sku_id: number;
   @Column({ length: 256, nullable: true }) spec_text: string;
   @Column({ type: 'int', default: 1 }) quantity: number;
   @Column({ type: 'tinyint', default: 1 }) checked: number;
   @CreateDateColumn() created_at: Date;
 }
