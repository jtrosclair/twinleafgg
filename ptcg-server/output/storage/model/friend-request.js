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
var FriendRequest_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequest = exports.FriendRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
var FriendRequestStatus;
(function (FriendRequestStatus) {
    FriendRequestStatus["PENDING"] = "pending";
    FriendRequestStatus["ACCEPTED"] = "accepted";
    FriendRequestStatus["REJECTED"] = "rejected";
})(FriendRequestStatus = exports.FriendRequestStatus || (exports.FriendRequestStatus = {}));
let FriendRequest = FriendRequest_1 = class FriendRequest extends typeorm_1.BaseEntity {
    static async findRequest(senderId, receiverId) {
        const request = await FriendRequest_1.findOne({
            where: { sender_id: senderId, receiver_id: receiverId },
            relations: ['sender', 'receiver']
        });
        return request || null;
    }
    static async getPendingRequests(userId) {
        return await FriendRequest_1.find({
            where: { receiver_id: userId, status: FriendRequestStatus.PENDING },
            relations: ['sender', 'receiver']
        });
    }
    static async getSentRequests(userId) {
        return await FriendRequest_1.find({
            where: { sender_id: userId, status: FriendRequestStatus.PENDING },
            relations: ['sender', 'receiver']
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FriendRequest.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FriendRequest.prototype, "sender_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User),
    typeorm_1.JoinColumn({ name: 'sender_id' }),
    __metadata("design:type", user_1.User)
], FriendRequest.prototype, "sender", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FriendRequest.prototype, "receiver_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User),
    typeorm_1.JoinColumn({ name: 'receiver_id' }),
    __metadata("design:type", user_1.User)
], FriendRequest.prototype, "receiver", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        default: FriendRequestStatus.PENDING
    }),
    __metadata("design:type", String)
], FriendRequest.prototype, "status", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], FriendRequest.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], FriendRequest.prototype, "updated_at", void 0);
FriendRequest = FriendRequest_1 = __decorate([
    typeorm_1.Entity()
], FriendRequest);
exports.FriendRequest = FriendRequest;
