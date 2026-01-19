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
var Friend_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friend = exports.FriendStatus = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
var FriendStatus;
(function (FriendStatus) {
    FriendStatus["PENDING"] = "pending";
    FriendStatus["ACCEPTED"] = "accepted";
    FriendStatus["BLOCKED"] = "blocked";
})(FriendStatus = exports.FriendStatus || (exports.FriendStatus = {}));
let Friend = Friend_1 = class Friend extends typeorm_1.BaseEntity {
    static async findFriendship(userId, friendId) {
        const friendship = await Friend_1.findOne({
            where: [
                { user_id: userId, friend_id: friendId },
                { user_id: friendId, friend_id: userId }
            ],
            relations: ['user', 'friend']
        });
        return friendship || null;
    }
    static async getFriendsList(userId) {
        return await Friend_1.find({
            where: [
                { user_id: userId, status: FriendStatus.ACCEPTED },
                { friend_id: userId, status: FriendStatus.ACCEPTED }
            ],
            relations: ['user', 'friend']
        });
    }
    static async getPendingRequests(userId) {
        return await Friend_1.find({
            where: { friend_id: userId, status: FriendStatus.PENDING },
            relations: ['user', 'friend']
        });
    }
    static async getSentRequests(userId) {
        return await Friend_1.find({
            where: { user_id: userId, status: FriendStatus.PENDING },
            relations: ['user', 'friend']
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Friend.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Friend.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_1.User)
], Friend.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Friend.prototype, "friend_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'friend_id' }),
    __metadata("design:type", user_1.User)
], Friend.prototype, "friend", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: FriendStatus.PENDING
    }),
    __metadata("design:type", String)
], Friend.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Friend.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Friend.prototype, "updated_at", void 0);
Friend = Friend_1 = __decorate([
    (0, typeorm_1.Entity)()
], Friend);
exports.Friend = Friend;
