import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('route_schedule')
export class RouteScheduleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  route_id: number;

  @Column({ type: 'tinyint', comment: '第几天' })
  day_number: number;

  @Column({ type: 'text', nullable: true, comment: '行程描述' })
  description: string;

  @Column({ length: 512, nullable: true, comment: '景点' })
  attractions: string;

  @Column({ length: 256, nullable: true, comment: '用餐' })
  meals: string;

  @Column({ length: 256, nullable: true, comment: '住宿' })
  accommodation: string;

  @Column({ length: 256, nullable: true, comment: '交通' })
  transport: string;
}
