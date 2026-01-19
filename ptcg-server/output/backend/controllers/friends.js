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
exports.Friends = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
class Friends extends controller_1.Controller {
    async onGetFriendsList(req, res) {
        const userId = req.body.userId;
        const friends = await storage_1.Friend.getFriendsList(userId);
        const users = [];
        const friendsList = [];
        friends.forEach(friend => {
            // Add safety checks
            if (!friend.user || !friend.friend) {
                console.error('Friend relations not loaded:', friend);
                return; // Skip this friend
            }
            const otherUser = friend.user_id === userId ? friend.friend : friend.user;
            const currentUser = friend.user_id === userId ? friend.user : friend.friend;
            if (!users.some(u => u.userId === otherUser.id)) {
                users.push(this.buildUserInfo(otherUser));
            }
            if (!users.some(u => u.userId === currentUser.id)) {
                users.push(this.buildUserInfo(currentUser));
            }
            friendsList.push({
                id: friend.id,
                user: this.buildUserInfo(currentUser),
                friend: this.buildUserInfo(otherUser),
                status: friend.status,
                created_at: friend.created_at,
                updated_at: friend.updated_at
            });
        });
        const response = {
            ok: true,
            friends: friendsList,
            users,
            total: friendsList.length
        };
        res.send(response);
    }
    async onGetPendingRequests(req, res) {
        const userId = req.body.userId;
        const requests = await storage_1.FriendRequest.getPendingRequests(userId);
        const users = [];
        const requestsList = [];
        requests.forEach(request => {
            if (!users.some(u => u.userId === request.sender.id)) {
                users.push(this.buildUserInfo(request.sender));
            }
            if (!users.some(u => u.userId === request.receiver.id)) {
                users.push(this.buildUserInfo(request.receiver));
            }
            requestsList.push({
                id: request.id,
                sender: this.buildUserInfo(request.sender),
                receiver: this.buildUserInfo(request.receiver),
                status: request.status,
                created_at: request.created_at,
                updated_at: request.updated_at
            });
        });
        const response = {
            ok: true,
            requests: requestsList,
            users,
            total: requestsList.length
        };
        res.send(response);
    }
    async onGetSentRequests(req, res) {
        const userId = req.body.userId;
        const requests = await storage_1.FriendRequest.getSentRequests(userId);
        const users = [];
        const requestsList = [];
        requests.forEach(request => {
            if (!users.some(u => u.userId === request.sender.id)) {
                users.push(this.buildUserInfo(request.sender));
            }
            if (!users.some(u => u.userId === request.receiver.id)) {
                users.push(this.buildUserInfo(request.receiver));
            }
            requestsList.push({
                id: request.id,
                sender: this.buildUserInfo(request.sender),
                receiver: this.buildUserInfo(request.receiver),
                status: request.status,
                created_at: request.created_at,
                updated_at: request.updated_at
            });
        });
        const response = {
            ok: true,
            requests: requestsList,
            users,
            total: requestsList.length
        };
        res.send(response);
    }
    async onSendFriendRequest(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        if (userId === body.receiverId) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        const receiver = await storage_1.User.findOne(body.receiverId);
        if (!receiver) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        // Check if friendship already exists
        const existingFriendship = await storage_1.Friend.findFriendship(userId, body.receiverId);
        if (existingFriendship) {
            res.status(400);
            res.send({ error: 'Friendship already exists' });
            return;
        }
        // Check if request already exists
        const existingRequest = await storage_1.FriendRequest.findRequest(userId, body.receiverId);
        if (existingRequest) {
            res.status(400);
            res.send({ error: 'Friend request already sent' });
            return;
        }
        const request = new storage_1.FriendRequest();
        request.sender_id = userId;
        request.receiver_id = body.receiverId;
        request.status = storage_1.FriendRequestStatus.PENDING;
        await request.save();
        res.send({ ok: true });
    }
    async onAcceptFriendRequest(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const request = await storage_1.FriendRequest.findOne({
            where: { id: body.requestId, receiver_id: userId, status: storage_1.FriendRequestStatus.PENDING },
            relations: ['sender', 'receiver']
        });
        if (!request) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        // Update request status
        request.status = storage_1.FriendRequestStatus.ACCEPTED;
        await request.save();
        // Create friendship
        const friendship = new storage_1.Friend();
        friendship.user_id = request.sender_id;
        friendship.friend_id = request.receiver_id;
        friendship.status = storage_1.FriendStatus.ACCEPTED;
        await friendship.save();
        res.send({ ok: true });
    }
    async onRejectFriendRequest(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const request = await storage_1.FriendRequest.findOne({
            where: { id: body.requestId, receiver_id: userId, status: storage_1.FriendRequestStatus.PENDING }
        });
        if (!request) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        request.status = storage_1.FriendRequestStatus.REJECTED;
        await request.save();
        res.send({ ok: true });
    }
    async onCancelFriendRequest(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const request = await storage_1.FriendRequest.findOne({
            where: { id: body.requestId, sender_id: userId, status: storage_1.FriendRequestStatus.PENDING }
        });
        if (!request) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        await request.remove();
        res.send({ ok: true });
    }
    async onRemoveFriend(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const friendship = await storage_1.Friend.findFriendship(userId, body.friendId);
        if (!friendship || friendship.status !== storage_1.FriendStatus.ACCEPTED) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        await friendship.remove();
        res.send({ ok: true });
    }
    async onBlockUser(req, res) {
        const currentUserId = req.body.userId;
        const body = req.body;
        if (currentUserId === body.userId) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        const targetUser = await storage_1.User.findOne(body.userId);
        if (!targetUser) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        // Check if friendship exists and update to blocked
        let friendship = await storage_1.Friend.findFriendship(currentUserId, body.userId);
        if (friendship) {
            friendship.status = storage_1.FriendStatus.BLOCKED;
            await friendship.save();
        }
        else {
            // Create new blocked friendship
            friendship = new storage_1.Friend();
            friendship.user_id = currentUserId;
            friendship.friend_id = body.userId;
            friendship.status = storage_1.FriendStatus.BLOCKED;
            await friendship.save();
        }
        res.send({ ok: true });
    }
    async onUnblockUser(req, res) {
        const currentUserId = req.body.userId;
        const body = req.body;
        const friendship = await storage_1.Friend.findFriendship(currentUserId, body.userId);
        if (!friendship || friendship.status !== storage_1.FriendStatus.BLOCKED) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        await friendship.remove();
        res.send({ ok: true });
    }
}
__decorate([
    (0, controller_1.Get)('/list'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onGetFriendsList", null);
__decorate([
    (0, controller_1.Get)('/requests/pending'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onGetPendingRequests", null);
__decorate([
    (0, controller_1.Get)('/requests/sent'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onGetSentRequests", null);
__decorate([
    (0, controller_1.Post)('/request/send'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        receiverId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onSendFriendRequest", null);
__decorate([
    (0, controller_1.Post)('/request/accept'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        requestId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onAcceptFriendRequest", null);
__decorate([
    (0, controller_1.Post)('/request/reject'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        requestId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onRejectFriendRequest", null);
__decorate([
    (0, controller_1.Post)('/request/cancel'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        requestId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onCancelFriendRequest", null);
__decorate([
    (0, controller_1.Post)('/remove'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        friendId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onRemoveFriend", null);
__decorate([
    (0, controller_1.Post)('/block'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        userId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onBlockUser", null);
__decorate([
    (0, controller_1.Post)('/unblock'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        userId: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Friends.prototype, "onUnblockUser", null);
exports.Friends = Friends;
