 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('operation_log')
 export class OperationLogEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) operator_id: number;
   @Column({ length: 32 }) action: string;
   @Column({ length: 64, nullable: true }) target: string;
   @Column({ type: 'text', nullable: true }) detail: string;
   @Column({ length: 64, nullable: true }) ip: string;
   @CreateDateColumn() created_at: Date;
 }
