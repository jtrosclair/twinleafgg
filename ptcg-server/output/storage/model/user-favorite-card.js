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
exports.UserFavoriteCard = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let UserFavoriteCard = class UserFavoriteCard extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.cardName = '';
        this.fullName = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserFavoriteCard.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User),
    typeorm_1.JoinColumn({ name: 'userId' }),
    __metadata("design:type", user_1.User)
], UserFavoriteCard.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserFavoriteCard.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserFavoriteCard.prototype, "cardName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserFavoriteCard.prototype, "fullName", void 0);
UserFavoriteCard = __decorate([
    typeorm_1.Entity('user_favorite_card'),
    typeorm_1.Unique(['user', 'cardName'])
], UserFavoriteCard);
exports.UserFavoriteCard = UserFavoriteCard;
