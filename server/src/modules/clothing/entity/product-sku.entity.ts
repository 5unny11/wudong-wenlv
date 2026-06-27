 import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 
 @Entity('product_sku')
 export class ProductSkuEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
   id: number;
   @Column({ type: 'bigint', unsigned: true })
   product_id: number;
   @Column({ length: 128 })
   spec_name: string;
   @Column({ type: 'decimal', precision: 10, scale: 2 })
   price: number;
   @Column({ type: 'int', default: 0 })
   stock: number;
   @Column({ length: 512, nullable: true })
   image: string;
 }
