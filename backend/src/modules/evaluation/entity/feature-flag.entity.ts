import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rule } from './rule.entity';
import { Variant } from './variant.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('feature_flags')
export class FeatureFlag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  flag_key!: string;

  @Column({ default: false })
  enabled!: boolean;

  @Column({ type: 'varchar', default: 'boolean' })
  type!: 'boolean' | 'config';

  @Column({ type: 'json', nullable: true })
  value!: any;

  @Column({ default: 0 })
  rollout_percentage!: number;

  @Column({ default: 'AND' })
  rule_type!: 'AND' | 'OR';

  @OneToMany(() => Rule, (rule) => rule.flag, { cascade: true })
  rules!: Rule[];

  @OneToMany(() => Variant, (variant) => variant.flag, { cascade: true })
  variants!: Variant[];

  @Column({ nullable: true })
  createdById!: string | null;

  @ManyToOne(() => User, (user) => user.createdFlags, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User | null;
}
