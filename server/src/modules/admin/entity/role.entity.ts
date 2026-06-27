 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('role')
 export class RoleEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ length: 64 }) name: string;
   @Column({ type: 'text', nullable: true }) permissions: string;
   @CreateDateColumn() created_at: Date;
 }
