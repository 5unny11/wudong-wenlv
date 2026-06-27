 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('homestay')
 export class HomestayEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 128 }) name: string;
   @Column({ type: 'bigint', unsigned: true }) merchant_id: number;
   @Column({ length: 512, nullable: true }) main_image: string;
   @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 }) rating: number;
   @Column({ length: 256, nullable: true }) address: string;
   @Column({ length: 32, nullable: true }) phone: string;
   @Column({ type: 'text', nullable: true }) intro: string;
   @Column({ type: 'simple-json', nullable: true }) facilities: string[];
   @Column({ type: 'simple-json', nullable: true }) tags: string[];
   @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) latitude: number;
   @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) longitude: number;
   @Column({ type: 'text', nullable: true }) check_in_info: string;
   @Column({ type: 'text', nullable: true }) cancel_policy: string;
   @Column({ type: 'tinyint', default: 1 }) status: number;
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
