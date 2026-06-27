 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('scenic_spot')
 export class ScenicSpotEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 128 }) name: string;
   @Column({ length: 256, nullable: true }) address: string;
   @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) latitude: number;
   @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) longitude: number;
   @Column({ length: 128, nullable: true }) open_time: string;
   @Column({ type: 'text', nullable: true }) intro: string;
   @Column({ length: 512, nullable: true }) main_image: string;
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
