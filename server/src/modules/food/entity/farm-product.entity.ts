 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('farm_product')
 export class FarmProductEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 128 }) title: string;
   @Column({ type: 'bigint', unsigned: true }) category_id: number;
   @Column({ type: 'bigint', unsigned: true }) merchant_id: number;
   @Column({ length: 512, nullable: true }) main_image: string;
   @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) market_price: number;
   @Column({ type: 'int', default: 0 }) stock: number;
   @Column({ type: 'int', default: 0 }) sales: number;
   @Column({ type: 'text', nullable: true }) detail: string;
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
