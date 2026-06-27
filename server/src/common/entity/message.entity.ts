 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('message')
 export class MessageEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 32 }) msg_type: string; // order/system/interact
   @Column({ length: 128 }) title: string;
   @Column({ type: 'text', nullable: true }) content: string;
   @Column({ type: 'tinyint', default: 0 }) is_read: number;
   @CreateDateColumn() created_at: Date;
 }
