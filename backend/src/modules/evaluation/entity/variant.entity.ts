import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FeatureFlag } from './feature-flag.entity';

@Entity('variants')
export class Variant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    weight!: number;

    @ManyToOne(() => FeatureFlag, flag => flag.variants)
    flag!: FeatureFlag;
}