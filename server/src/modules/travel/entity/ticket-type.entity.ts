 import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 @Entity('ticket_type')
 export class TicketTypeEntity {
   @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
   @Column({ type: 'bigint', unsigned: true }) scenic_spot_id: number;
   @Column({ length: 64 }) name: string; // 成人票/儿童票/学生票/家庭套票
   @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
   @Column({ type: 'int', default: 0 }) stock: number;
   @Column({ type: 'int', nullable: true }) valid_days: number; // 有效期天数
 }
