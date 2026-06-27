 import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 @Entity('farm_product_sku')
 export class FarmProductSkuEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) product_id: number;
   @Column({ length: 64 }) spec_name: string;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
   @Column({ type: 'int', default: 0 }) stock: number;
 }
