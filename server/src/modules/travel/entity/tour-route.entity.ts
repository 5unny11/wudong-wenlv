 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('tour_route')
 export class TourRouteEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 128 }) title: string;
   @Column({ length: 16 }) duration: string; // one_day/two_day/multi_day
   @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
   @Column({ type: 'text', nullable: true }) includes: string;
   @Column({ type: 'text', nullable: true }) schedule: string;
   @Column({ length: 64, nullable: true }) start_city: string;
   @Column({ length: 64, nullable: true }) dest_city: string;
   @Column({ length: 512, nullable: true }) main_image: string;
   @Column({ type: 'text', nullable: true }) detail: string;
   @Column({ type: 'text', nullable: true }) notice: string;
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @Column({ type: 'bigint', unsigned: true }) merchant_id: number;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
