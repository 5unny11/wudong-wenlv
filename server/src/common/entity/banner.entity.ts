 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('banner')
 export class BannerEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 128 }) title: string;
   @Column({ length: 512 }) image_url: string;
   @Column({ length: 512, nullable: true }) link_url: string;
   @Column({ type: 'int', default: 0 }) sort_order: number;
   @Column({ length: 16, default: 'web' }) platform: string; // web / miniapp
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
