 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 @Entity('user_address')
 export class AddressEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 64 }) receiver_name: string;
   @Column({ length: 20 }) receiver_phone: string;
   @Column({ length: 512 }) address: string;
   @Column({ length: 32, nullable: true }) region: string;
   @Column({ type: 'tinyint', default: 0 }) is_default: number;
   @CreateDateColumn() created_at: Date;
 }
