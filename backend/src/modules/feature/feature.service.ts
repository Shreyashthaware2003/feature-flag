import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { FeatureFlag } from "../evaluation/entity/feature-flag.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FeatureService {
    constructor(
        @InjectRepository(FeatureFlag)
        private readonly flagRepo: Repository<FeatureFlag>
    ) { }

    async getFlagWithRules(flagKey: string) {
        return this.flagRepo.findOne({
            where: { flag_key: flagKey },
            relations: ['rules']
        });
    }


}