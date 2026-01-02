"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattlePassSeason = void 0;
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path = require("path");
let BattlePassSeason = class BattlePassSeason extends typeorm_1.BaseEntity {
    loadRewards() {
        const rewardsPath = path.join(__dirname, this.rewardsFile);
        try {
            if (fs.existsSync(rewardsPath)) {
                const rawData = fs.readFileSync(rewardsPath, 'utf-8');
                const parsed = JSON.parse(rawData);
                // Remove premium track completely at load time
                this.rewards = Array.isArray(parsed)
                    ? parsed.filter((r) => !(r === null || r === void 0 ? void 0 : r.isPremium))
                    : [];
            }
            else {
                console.error(`[BattlePass] Rewards file not found at: ${rewardsPath}`);
                this.rewards = [];
            }
        }
        catch (error) {
            console.error(`[BattlePass] Error loading or parsing rewards file: ${rewardsPath}`, error);
            this.rewards = [];
        }
    }
    /**
     * Get rewards for a specific level (premium track removed: only non-premium rewards are available)
     */
    getRewardsForLevel(level, _isPremium) {
        return this.rewards.filter(reward => reward.level === level && !reward.isPremium);
    }
    /**
     * Calculate XP needed for a specific level
     */
    getXpForLevel(level) {
        return this.baseXpPerLevel + (level - 1) * this.xpIncreasePerLevel;
    }
    /**
     * Calculate total XP needed up to a specific level
     */
    getTotalXpForLevel(level) {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += this.getXpForLevel(i);
        }
        return total;
    }
    /**
     * Get the level for a given amount of XP
     */
    getLevelForXp(xp) {
        let level = 1;
        while (level < this.maxLevel) {
            const xpForNextLevel = this.getTotalXpForLevel(level + 1);
            if (xp < xpForNextLevel) {
                return level;
            }
            level++;
        }
        return this.maxLevel;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BattlePassSeason.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], BattlePassSeason.prototype, "seasonId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BattlePassSeason.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', default: () => '(CURRENT_DATE)' }),
    __metadata("design:type", Date)
], BattlePassSeason.prototype, "startDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', default: () => '(CURRENT_DATE)' }),
    __metadata("design:type", Date)
], BattlePassSeason.prototype, "endDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BattlePassSeason.prototype, "rewardsFile", void 0);
__decorate([
    typeorm_1.Column({ default: 1000 }) // Base XP needed per level
    ,
    __metadata("design:type", Number)
], BattlePassSeason.prototype, "baseXpPerLevel", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }) // XP increase per level
    ,
    __metadata("design:type", Number)
], BattlePassSeason.prototype, "xpIncreasePerLevel", void 0);
__decorate([
    typeorm_1.Column({ default: 100 }) // Max level for the season
    ,
    __metadata("design:type", Number)
], BattlePassSeason.prototype, "maxLevel", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], BattlePassSeason.prototype, "created", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], BattlePassSeason.prototype, "updated", void 0);
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BattlePassSeason.prototype, "loadRewards", null);
BattlePassSeason = __decorate([
    typeorm_1.Entity()
], BattlePassSeason);
exports.BattlePassSeason = BattlePassSeason;
