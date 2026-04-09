import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureFlag } from "./feature-flag.entity";

@Entity('rules')
export class Rule {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    field!: string;

    @Column()
    operator!: string;

    @Column()
    value!: string;

    @ManyToOne(() => FeatureFlag, flag => flag.rules, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'flag_id' })
    flag!: FeatureFlag;
}