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
exports.UserBattlePass = void 0;
const typeorm_1 = require("typeorm");
const _1 = require("./");
let UserBattlePass = class UserBattlePass extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.claimedRewards = [];
    }
    async canClaimReward(level) {
        if (level < 1 || level > this.level) {
            return false;
        }
        return !this.claimedRewards.includes(level);
    }
    async claimReward(level) {
        if (await this.canClaimReward(level)) {
            this.claimedRewards.push(level);
        }
    }
    async addExp(exp) {
        this.exp += exp;
        const currentLevel = this.level;
        const newLevel = this.season.getLevelForXp(this.exp);
        if (newLevel > currentLevel) {
            this.level = newLevel;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserBattlePass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserBattlePass.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", _1.User)
], UserBattlePass.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserBattlePass.prototype, "seasonId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.BattlePassSeason),
    (0, typeorm_1.JoinColumn)({ name: 'seasonId', referencedColumnName: 'seasonId' }),
    __metadata("design:type", _1.BattlePassSeason)
], UserBattlePass.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserBattlePass.prototype, "exp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], UserBattlePass.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], UserBattlePass.prototype, "claimedRewards", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserBattlePass.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserBattlePass.prototype, "updated", void 0);
UserBattlePass = __decorate([
    (0, typeorm_1.Entity)()
], UserBattlePass);
exports.UserBattlePass = UserBattlePass;
