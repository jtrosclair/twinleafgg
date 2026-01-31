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
const IMAGE_JSON_URL = 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/small.json';
class Cards extends controller_1.Controller {
    constructor() {
        super(...arguments);
        this.imageMap = {};
    }
    async onAll(req, res) {
        if (!this.cardsInfo) {
            await this.fetchImageMap();
            this.cardsInfo = this.buildCardsInfo();
        }
        res.send({ ok: true, cardsInfo: this.cardsInfo });
    }
    async onHash(req, res) {
        if (!this.cardsInfo) {
            await this.fetchImageMap();
            this.cardsInfo = this.buildCardsInfo();
        }
        const cardsTotal = this.cardsInfo.cards.length;
        const hash = this.cardsInfo.hash;
        res.send({ ok: true, cardsTotal, hash });
    }
    async fetchImageMap() {
        if (Object.keys(this.imageMap).length > 0) {
            return;
        }
        try {
            const response = await fetch(IMAGE_JSON_URL);
            if (response.ok) {
                this.imageMap = await response.json();
                console.log(`Loaded ${Object.keys(this.imageMap).length} card images from remote`);
            }
        }
        catch (error) {
            console.error('Failed to fetch card images:', error);
        }
    }
    buildCardsInfo() {
        const cardManager = game_1.CardManager.getInstance();
        const cards = cardManager.getAllCards();
        // Update card images from the image map
        for (const card of cards) {
            const key = `${card.set} ${card.setNumber}`;
            if (this.imageMap[key]) {
                card.cardImage = this.imageMap[key];
            }
        }
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
