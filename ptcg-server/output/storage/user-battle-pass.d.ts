import { BaseEntity } from 'typeorm';
import { User, BattlePassSeason } from './';
export declare class UserBattlePass extends BaseEntity {
    id: number;
    userId: number;
    user: User;
    seasonId: string;
    season: BattlePassSeason;
    exp: number;
    level: number;
    claimedRewards: number[];
    created: Date;
    updated: Date;
    canClaimReward(level: number): Promise<boolean>;
    claimReward(level: number): Promise<void>;
    addExp(exp: number): Promise<void>;
}
