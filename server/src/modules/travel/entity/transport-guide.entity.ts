import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transport_guide')
export class TransportGuideEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 128 })
  title: string;

  @Column({ length: 64, comment: '出发地' })
  departure: string;

  @Column({ length: 64, comment: '目的地' })
  destination: string;

  @Column({ length: 32, comment: '交通方式' })
  transport_mode: string;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true, comment: '时长(小时)' })
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '费用' })
  cost: number;

  @Column({ type: 'text', nullable: true, comment: '详细说明' })
  detail: string;

  @Column({ length: 512, nullable: true, comment: '攻略图' })
  guide_image: string;

  @Column({ type: 'tinyint', default: 1, comment: '1显示 0隐藏' })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
