 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('travel_note')
 export class TravelNoteEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 128 }) title: string;
   @Column({ type: 'text' }) content: string;
   @Column({ type: 'simple-json', nullable: true }) images: string[];
   @Column({ length: 512, nullable: true }) video_url: string;
   @Column({ type: 'simple-json', nullable: true }) topics: string[];
   @Column({ type: 'simple-json', nullable: true }) locations: string[];
   @Column({ type: 'int', default: 0 }) like_count: number;
   @Column({ type: 'int', default: 0 }) comment_count: number;
   @Column({ type: 'int', default: 0 }) view_count: number;
   @Column({ type: 'tinyint', default: 2 }) status: number; // 0审核中 1正常 2已下架
   @CreateDateColumn() created_at: Date;
 }
