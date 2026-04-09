import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rule } from './rule.entity';

@Entity('feature_flags')
export class FeatureFlag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    flag_key!: string;

    @Column({ default: false })
    enabled!: boolean;

    @Column({ default: 0 })
    rollout_percentage!: number;

    @OneToMany(() => Rule, rule => rule.flag, { cascade: true })
    rules!: Rule[];
}