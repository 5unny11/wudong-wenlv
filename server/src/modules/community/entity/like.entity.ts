 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('like_collect')
 export class LikeEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 16 }) target_type: string; // note / comment
   @Column({ type: 'bigint', unsigned: true }) target_id: number;
   @CreateDateColumn() created_at: Date;
 }
