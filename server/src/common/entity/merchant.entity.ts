 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 @Entity('merchant')
 export class MerchantEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) user_id: number;
   @Column({ length: 128 }) shop_name: string;
   @Column({ length: 16 }) module: string; // clothing/food/housing/travel
   @Column({ length: 32, nullable: true }) contact_name: string;
   @Column({ length: 20, nullable: true }) contact_phone: string;
   @Column({ type: 'tinyint', default: 1 }) status: number; // 1正常 2禁用 3待审核
   @CreateDateColumn() created_at: Date;
   @UpdateDateColumn() updated_at: Date;
 }
