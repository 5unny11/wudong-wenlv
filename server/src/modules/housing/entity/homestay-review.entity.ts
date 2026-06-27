 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('homestay_review')
 export class HomestayReviewEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) order_id: number;
   @Column({ type: 'bigint', unsigned: true }) homestay_id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'tinyint', default: 5 }) rating: number;
   @Column({ type: 'text', nullable: true }) content: string;
   @Column({ type: 'simple-json', nullable: true }) images: string[];
   @Column({ type: 'text', nullable: true }) reply: string;
   @CreateDateColumn() created_at: Date;
 }
