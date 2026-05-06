import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrackingEvent } from '../../tracking/entities/tracking-event.entity';
import { FeatureFlag } from '../../evaluation/entity/feature-flag.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 120, default: '' })
  full_name!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', nullable: true })
  refreshTokenHash!: string | null;

  @OneToMany(() => TrackingEvent, (event) => event.user)
  trackingEvents!: TrackingEvent[];

  @OneToMany(() => FeatureFlag, (flag) => flag.createdBy)
  createdFlags!: FeatureFlag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
