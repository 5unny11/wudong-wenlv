 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('topic')
 export class TopicEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 64 }) name: string;
   @Column({ length: 256, nullable: true }) intro: string;
   @Column({ type: 'int', default: 0 }) follow_count: number;
   @Column({ type: 'int', default: 0 }) note_count: number;
   @CreateDateColumn() created_at: Date;
 }
