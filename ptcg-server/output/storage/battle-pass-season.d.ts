import { BaseEntity } from 'typeorm';
export interface BattlePassReward {
    level: number;
    item: string;
    type: 'avatar' | 'card_back' | 'playmat' | 'marker' | 'card_artwork';
    name: string;
    isPremium: boolean;
}
export declare class BattlePassSeason extends BaseEntity {
    id: number;
    seasonId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    rewardsFile: string;
    rewards: BattlePassReward[];
    baseXpPerLevel: number;
    xpIncreasePerLevel: number;
    maxLevel: number;
    created: Date;
    updated: Date;
    loadRewards(): void;
    /**
     * Get rewards for a specific level (premium track removed: only non-premium rewards are available)
     */
    getRewardsForLevel(level: number, _isPremium: boolean): BattlePassReward[];
    /**
     * Calculate XP needed for a specific level
     */
    getXpForLevel(level: number): number;
    /**
     * Calculate total XP needed up to a specific level
     */
    getTotalXpForLevel(level: number): number;
    /**
     * Get the level for a given amount of XP
     */
    getLevelForXp(xp: number): number;
}
