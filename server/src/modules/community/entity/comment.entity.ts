 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('comment')
 export class CommentEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) note_id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'text' }) content: string;
   @Column({ type: 'bigint', unsigned: true, nullable: true }) reply_to: number;
   @Column({ type: 'bigint', unsigned: true, nullable: true }) reply_user: number;
   @Column({ type: 'int', default: 0 }) like_count: number;
   @CreateDateColumn() created_at: Date;
 }
