 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
 
 @Entity('product')
 export class ProductEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
   id: number;
 
   @Column({ length: 128 })
   title: string;
 
   @Column({ length: 256, nullable: true })
   subtitle: string;
 
   @Column({ type: 'bigint', unsigned: true })
   category_id: number;
 
   @Column({ type: 'bigint', unsigned: true })
   merchant_id: number;
 
   @Column({ length: 512, nullable: true })
   main_image: string;
 
   @Column({ type: 'decimal', precision: 10, scale: 2 })
   price: number;
 
   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '市场价' })
   market_price: number;
 
   @Column({ type: 'int', default: 0 })
   stock: number;
 
   @Column({ type: 'int', default: 0 })
   sales: number;
 
   @Column({ type: 'text', nullable: true })
   detail: string;
 
   @Column({ type: 'text', nullable: true })
   craft_desc: string;
 
   @Column({ length: 64, nullable: true })
   inheritor: string;
 
   @Column({ type: 'tinyint', default: 1 })
   status: number; // 1上架 0下架
 
   @CreateDateColumn()
   created_at: Date;
 
   @UpdateDateColumn()
   updated_at: Date;
 }
