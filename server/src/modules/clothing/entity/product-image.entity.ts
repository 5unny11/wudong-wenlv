 import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 @Entity('product_image')
 export class ProductImageEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
   id: number;
   @Column({ type: 'bigint', unsigned: true })
   product_id: number;
   @Column({ length: 512 })
   image_url: string;
   @Column({ type: 'int', default: 0 })
   sort_order: number;
 }
