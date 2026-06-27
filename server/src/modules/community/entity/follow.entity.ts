 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('follow')
 export class FollowEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ type: 'bigint', unsigned: true }) follow_user_id: number;
   @CreateDateColumn() created_at: Date;
 }
