import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureFlag } from "../evaluation/entity/feature-flag.entity";
import { Rule } from "../evaluation/entity/rule.entity";
import { FeatureService } from "./feature.service";

@Module({
    imports: [TypeOrmModule.forFeature([FeatureFlag, Rule])],
    exports: [FeatureService],
    providers: [FeatureService],
    // controllers:[FeatureController]
})

export class FeatureModule { }