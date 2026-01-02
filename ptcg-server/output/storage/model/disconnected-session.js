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
exports.DisconnectedSession = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const bigint_1 = require("../transformers/bigint");
let DisconnectedSession = class DisconnectedSession extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DisconnectedSession.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DisconnectedSession.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DisconnectedSession.prototype, "gameId", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], DisconnectedSession.prototype, "gameState", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], DisconnectedSession.prototype, "disconnectedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], DisconnectedSession.prototype, "expiresAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DisconnectedSession.prototype, "gamePhase", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], DisconnectedSession.prototype, "isPlayerTurn", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DisconnectedSession.prototype, "disconnectionReason", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User),
    typeorm_1.JoinColumn({ name: 'userId' }),
    __metadata("design:type", user_1.User)
], DisconnectedSession.prototype, "user", void 0);
DisconnectedSession = __decorate([
    typeorm_1.Entity('disconnected_session')
], DisconnectedSession);
exports.DisconnectedSession = DisconnectedSession;
