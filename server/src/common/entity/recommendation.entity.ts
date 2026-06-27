 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('recommendation')
 export class RecommendationEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 64 }) name: string;
   @Column({ length: 16 }) target_type: string; // product/restaurant/homestay/route/note
   @Column({ type: 'bigint', unsigned: true }) target_id: number;
   @Column({ type: 'int', default: 0 }) sort_order: number;
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @CreateDateColumn() created_at: Date;
 }
