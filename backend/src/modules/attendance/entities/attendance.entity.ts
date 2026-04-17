import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD format to group daily attendances easily

  @Column({ type: 'timestamp', nullable: true })
  clockInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOutTime: Date;

  @Column({ type: 'text', nullable: true })
  selfieUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean; // Optional: feature for Admin to approve WFH attendances

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
