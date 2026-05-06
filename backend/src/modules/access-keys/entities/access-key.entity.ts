import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('access_keys')
export class AccessKey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120, default: 'Default Key' })
  name!: string;

  @Column({ type: 'varchar', length: 40 })
  prefix!: string;

  @Column({ type: 'varchar', length: 12 })
  last4!: string;

  @Column({ type: 'varchar' })
  keyHash!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastUsedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @Column()
  ownerUserId!: string;

  @ManyToOne(() => User, (user) => user.accessKeys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerUserId' })
  ownerUser!: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
