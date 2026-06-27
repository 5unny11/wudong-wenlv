 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
 
 @Entity('category')
 export class CategoryEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
   id: number;
 
   @Column({ length: 64 })
   name: string;
 
   @Column({ type: 'bigint', unsigned: true, nullable: true })
   parent_id: number;
 
   @Column({ length: 256, nullable: true })
   icon: string;
 
   @Column({ type: 'int', default: 0 })
   sort_order: number;
 
   @Column({ type: 'tinyint', default: 1 })
   status: number; // 1启用 0禁用
 
   @Column({ length: 32, nullable: true })
   module: string; // clothing/food/scenic
 
   @CreateDateColumn()
   created_at: Date;
 }
