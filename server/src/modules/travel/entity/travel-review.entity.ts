import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('travel_review')
export class TravelReviewEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  order_id: number;

  @Column({ type: 'bigint', unsigned: true, comment: '关联景区或路线ID' })
  target_id: number;

  @Column({ length: 16, comment: 'scenic_spot / tour_route' })
  target_type: string;

  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'tinyint', comment: '1-5星评分' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'simple-json', nullable: true, comment: '评价图片' })
  images: string[];

  @CreateDateColumn()
  created_at: Date;
}
