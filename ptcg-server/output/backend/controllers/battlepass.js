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
exports.BattlePass = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const storage_1 = require("../../storage");
const errors_1 = require("../common/errors");
const typeorm_1 = require("typeorm");
class BattlePass extends controller_1.Controller {
    constructor(path, app, db, core) {
        super(path, app, db, core);
    }
    // GET /v1/battlepass/current
    async onGetCurrent(req, res) {
        try {
            // Use YYYY-MM-DD string to avoid timezone issues with DATE columns.
            const today = new Date().toISOString().slice(0, 10);
            const currentSeason = await storage_1.BattlePassSeason.findOne({
                where: {
                    startDate: (0, typeorm_1.LessThanOrEqual)(today),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(today)
                }
            });
            if (!currentSeason) {
                res.status(404).send({ error: 'No active battle pass season' });
                return;
            }
            // Premium track removed; no user premium status needed
            res.send({
                ok: true,
                season: {
                    id: currentSeason.id,
                    seasonId: currentSeason.seasonId,
                    name: currentSeason.name,
                    startDate: currentSeason.startDate,
                    endDate: currentSeason.endDate,
                    rewards: currentSeason.rewards,
                    maxLevel: currentSeason.maxLevel
                }
            });
        }
        catch (error) {
            console.error('Error fetching current season:', error);
            res.status(500).send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
    // GET /v1/battlepass/progress
    async onGetProgress(req, res) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
        try {
            const userId = req.body.userId;
            const now = new Date();
            // Get current season
            const currentSeason = await storage_1.BattlePassSeason.findOne({
                where: {
                    startDate: (0, typeorm_1.LessThanOrEqual)(now),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(now)
                }
            });
            if (!currentSeason) {
                res.status(404).send({ error: 'No active battle pass season' });
                return;
            }
            // Get user
            const user = await storage_1.User.findOne(userId);
            if (!user) {
                res.status(400).send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
                return;
            }
            // Get or create user progress
            let progress = await storage_1.UserBattlePass.findOne({
                where: {
                    userId,
                    seasonId: currentSeason.seasonId
                },
                relations: ['season']
            });
            if (!progress) {
                progress = new storage_1.UserBattlePass();
                progress.userId = userId;
                progress.seasonId = currentSeason.seasonId;
                progress.season = currentSeason;
                progress.user = user;
                // await progress.save();
            }
            // Get available rewards for current level (premium track removed globally)
            const availableRewards = currentSeason.getRewardsForLevel(progress.level, false);
            res.send({
                ok: true,
                progress: {
                    exp: progress.exp,
                    level: progress.level,
                    claimedRewards: progress.claimedRewards,
                    nextLevelXp: currentSeason.getXpForLevel(progress.level),
                    totalXpForCurrentLevel: currentSeason.getTotalXpForLevel(progress.level),
                    availableRewards
                }
            });
        }
        catch (error) {
            console.error('Error fetching progress:', error);
            res.status(500).send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
    async onClaim(req, res) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
        try {
            const userId = req.body.userId;
            const level = req.body.level;
            const now = new Date();
            // Get current season
            const currentSeason = await storage_1.BattlePassSeason.findOne({
                where: {
                    startDate: (0, typeorm_1.LessThanOrEqual)(now),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(now)
                }
            });
            if (!currentSeason) {
                res.status(404).send({ error: 'No active battle pass season' });
                return;
            }
            // Get user
            const user = await storage_1.User.findOne(userId);
            if (!user) {
                res.status(400).send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
                return;
            }
            // Get user progress
            const progress = await storage_1.UserBattlePass.findOne({
                where: {
                    userId,
                    seasonId: currentSeason.seasonId
                },
                relations: ['season', 'user']
            });
            if (!progress) {
                res.status(400).send({ error: 'No battle pass progress found' });
                return;
            }
            // Check if reward can be claimed
            if (!(await progress.canClaimReward(level))) {
                res.status(400).send({ error: 'Cannot claim reward' });
                return;
            }
            // Get the rewards for this level (premium track removed globally)
            const rewards = currentSeason.getRewardsForLevel(level, false);
            if (rewards.length === 0) {
                res.status(400).send({ error: 'No available rewards' });
                return;
            }
            // Save the claimed reward
            await progress.claimReward(level);
            // Grant the items to the user
            for (const reward of rewards) {
                switch (reward.type) {
                    case 'avatar':
                    case 'card_back':
                    case 'playmat':
                    case 'marker':
                    case 'card_artwork': {
                        const unlockedItem = new storage_1.UserUnlockedItem();
                        unlockedItem.userId = userId;
                        unlockedItem.itemId = reward.item;
                        unlockedItem.itemType = reward.type;
                        // await unlockedItem.save();
                        break;
                    }
                }
            }
            //  await progress.save();
            res.send({
                ok: true,
                rewards,
                progress: {
                    exp: progress.exp,
                    level: progress.level,
                    claimedRewards: progress.claimedRewards,
                }
            });
        }
        catch (error) {
            console.error('Error claiming reward:', error);
            res.status(500).send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
    async onAddDebugExp(req, res) {
        try {
            const userId = req.body.userId;
            const exp = req.body.exp;
            const now = new Date();
            // Get current season
            const currentSeason = await storage_1.BattlePassSeason.findOne({
                where: {
                    startDate: (0, typeorm_1.LessThanOrEqual)(now),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(now)
                }
            });
            if (!currentSeason) {
                return res.status(404).send({ error: 'No active battle pass season' });
            }
            // Get user and ensure they are an admin
            const user = await storage_1.User.findOne(userId);
            if (!user) {
                return res.status(400).send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            }
            // Get or create user progress
            let progress = await storage_1.UserBattlePass.findOne({
                where: {
                    userId,
                    seasonId: currentSeason.seasonId
                },
                relations: ['season']
            });
            if (!progress) {
                progress = new storage_1.UserBattlePass();
                progress.userId = userId;
                progress.seasonId = currentSeason.seasonId;
                progress.exp = 0;
                progress.level = 1;
                progress.claimedRewards = [];
                progress.season = currentSeason;
            }
            // Add experience and save
            await progress.addExp(exp);
            //    await progress.save();
            res.send({ ok: true });
        }
        catch (error) {
            console.error('Error adding debug exp:', error);
            res.status(500).send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
    async onAddExp(req, res) {
        try {
            const userId = req.body.userId;
            const exp = req.body.exp;
            const now = new Date();
            // Get current season
            const currentSeason = await storage_1.BattlePassSeason.findOne({
                where: {
                    startDate: (0, typeorm_1.LessThanOrEqual)(now),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(now)
                }
            });
            if (!currentSeason) {
                res.status(404).send({ error: 'No active battle pass season' });
                return;
            }
            // Get user
            const user = await storage_1.User.findOne(userId);
            if (!user) {
                res.status(400).send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
                return;
            }
            // Get or create user progress
            let progress = await storage_1.UserBattlePass.findOne({
                where: {
                    userId,
                    seasonId: currentSeason.seasonId
                },
                relations: ['season', 'user']
            });
            if (!progress) {
                progress = new storage_1.UserBattlePass();
                progress.userId = userId;
                progress.seasonId = currentSeason.seasonId;
                progress.season = currentSeason;
                progress.user = user;
            }
            const oldLevel = progress.level;
            await progress.addExp(exp);
            //    await progress.save();
            // Check for level up
            const leveledUp = progress.level > oldLevel;
            // Get available rewards if leveled up (premium removed)
            const availableRewards = leveledUp ?
                currentSeason.getRewardsForLevel(progress.level, false) :
                [];
            res.send({
                ok: true,
                progress: {
                    exp: progress.exp,
                    level: progress.level,
                    claimedRewards: progress.claimedRewards,
                    leveledUp,
                    nextLevelXp: currentSeason.getXpForLevel(progress.level),
                    totalXpForCurrentLevel: currentSeason.getTotalXpForLevel(progress.level),
                    availableRewards
                }
            });
        }
        catch (error) {
            console.error('Error adding exp:', error);
            res.status(500).send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
    // GET /v1/battlepass/seasons (optional, for history)
    async onGetSeasons(req, res) {
        try {
            const seasons = await storage_1.BattlePassSeason.find({
                order: {
                    startDate: 'DESC'
                }
            });
            res.send({
                ok: true,
                seasons: seasons.map(season => ({
                    id: season.id,
                    seasonId: season.seasonId,
                    name: season.name,
                    startDate: season.startDate,
                    endDate: season.endDate,
                    maxLevel: season.maxLevel
                }))
            });
        }
        catch (error) {
            console.error('Error fetching seasons:', error);
            res.status(500).send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
}
__decorate([
    (0, controller_1.Get)('/current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BattlePass.prototype, "onGetCurrent", null);
__decorate([
    (0, controller_1.Get)('/progress'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BattlePass.prototype, "onGetProgress", null);
__decorate([
    (0, controller_1.Post)('/claim'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        level: (0, services_1.check)().isNumber().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BattlePass.prototype, "onClaim", null);
__decorate([
    (0, controller_1.Post)('/debug/add-exp'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        exp: (0, services_1.check)().isNumber().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BattlePass.prototype, "onAddDebugExp", null);
__decorate([
    (0, controller_1.Post)('/exp'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        exp: (0, services_1.check)().isNumber().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BattlePass.prototype, "onAddExp", null);
__decorate([
    (0, controller_1.Get)('/seasons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BattlePass.prototype, "onGetSeasons", null);
exports.BattlePass = BattlePass;
