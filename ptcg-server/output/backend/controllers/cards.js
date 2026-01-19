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
exports.Cards = void 0;
const controller_1 = require("./controller");
const game_1 = require("../../game");
const md5_1 = require("../../utils/md5");
class Cards extends controller_1.Controller {
    async onAll(req, res) {
        if (!this.cardsInfo) {
            this.cardsInfo = this.buildCardsInfo();
        }
        res.send({ ok: true, cardsInfo: this.cardsInfo });
    }
    async onHash(req, res) {
        if (!this.cardsInfo) {
            this.cardsInfo = this.buildCardsInfo();
        }
        const cardsTotal = this.cardsInfo.cards.length;
        const hash = this.cardsInfo.hash;
        res.send({ ok: true, cardsTotal, hash });
    }
    buildCardsInfo() {
        const cardManager = game_1.CardManager.getInstance();
        const cards = cardManager.getAllCards();
        const cardsInfo = {
            cards,
            hash: ''
        };
        const hash = md5_1.Md5.init(JSON.stringify(cardsInfo));
        cardsInfo.hash = hash;
        return cardsInfo;
    }
}
__decorate([
    (0, controller_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Cards.prototype, "onAll", null);
__decorate([
    (0, controller_1.Get)('/hash'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Cards.prototype, "onHash", null);
exports.Cards = Cards;
