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
exports.Favorites = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const game_1 = require("../../game");
class Favorites extends controller_1.Controller {
    async onList(req, res) {
        const userId = req.body.userId;
        const favorites = await storage_1.UserFavoriteCard.find({ where: { userId } });
        const favoritesMap = {};
        favorites.forEach(fav => {
            favoritesMap[fav.cardName] = fav.fullName;
        });
        res.send({ ok: true, favorites: favoritesMap });
    }
    async onSet(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        // Validate that the card exists
        const cardManager = game_1.CardManager.getInstance();
        const card = cardManager.getCardByName(body.fullName);
        if (!card || card.name !== body.cardName) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM });
            return;
        }
        // Find existing favorite or create new
        let favorite = await storage_1.UserFavoriteCard.findOne({
            where: { userId, cardName: body.cardName }
        });
        if (favorite) {
            favorite.fullName = body.fullName;
        }
        else {
            favorite = new storage_1.UserFavoriteCard();
            favorite.userId = userId;
            favorite.cardName = body.cardName;
            favorite.fullName = body.fullName;
        }
        try {
            await favorite.save();
            res.send({ ok: true });
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
        }
    }
    async onClear(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const favorite = await storage_1.UserFavoriteCard.findOne({
            where: { userId, cardName: body.cardName }
        });
        if (favorite) {
            try {
                await favorite.remove();
                res.send({ ok: true });
            }
            catch (error) {
                res.status(400);
                res.send({ error: errors_1.ApiErrorEnum.SERVER_ERROR });
            }
        }
        else {
            res.send({ ok: true });
        }
    }
}
__decorate([
    (0, controller_1.Get)('/list'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Favorites.prototype, "onList", null);
__decorate([
    (0, controller_1.Post)('/set'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        cardName: (0, services_1.check)().required(),
        fullName: (0, services_1.check)().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Favorites.prototype, "onSet", null);
__decorate([
    (0, controller_1.Post)('/clear'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        cardName: (0, services_1.check)().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Favorites.prototype, "onClear", null);
exports.Favorites = Favorites;
