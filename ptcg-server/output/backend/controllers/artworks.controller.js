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
exports.Artworks = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const storage_1 = require("../../storage");
const services_2 = require("../services");
const typeorm_1 = require("typeorm");
class Artworks extends controller_1.Controller {
    constructor(path, app, db, core) {
        super(path, app, db, core);
    }
    // Admin helper: upsert a card artwork row
    async onUpsertArtwork(req, res) {
        try {
            const userRole = req.body.roleId || 0;
            if (userRole < 4) { // require admin+ (roleId 4/5)
                return res.status(403).send({ error: 'Forbidden' });
            }
            const { id, name, cardName, setCode, code, imageUrl, holoType } = req.body;
            let row = await storage_1.CardArtwork.findOne({ where: { id } });
            if (!row) {
                row = new storage_1.CardArtwork();
                row.id = id;
            }
            row.name = name;
            row.cardName = cardName;
            row.setCode = setCode;
            row.code = code;
            row.imageUrl = imageUrl;
            row.holoType = holoType || 'default';
            await row.save();
            res.send({ ok: true, artwork: row });
        }
        catch (err) {
            console.error('Upsert artwork failed', err);
            res.status(500).send({ error: 'Server error' });
        }
    }
    // Admin helper: grant unlock to a user
    async onGrantArtwork(req, res) {
        try {
            const userRole = req.body.roleId || 0;
            if (userRole < 4) { // require admin+ (roleId 4/5)
                return res.status(403).send({ error: 'Forbidden' });
            }
            const userId = req.body.userId; // from AuthToken middleware
            const { artworkId } = req.body;
            const exists = await storage_1.UserUnlockedItem.findOne({ where: { userId, itemType: 'card_artwork', itemId: String(artworkId) } });
            if (!exists) {
                const unlockedItem = new storage_1.UserUnlockedItem();
                unlockedItem.userId = userId;
                unlockedItem.itemId = String(artworkId);
                unlockedItem.itemType = 'card_artwork';
                await unlockedItem.save();
            }
            res.send({ ok: true });
        }
        catch (err) {
            console.error('Grant artwork failed', err);
            res.status(500).send({ error: 'Server error' });
        }
    }
    async onGetUnlockedArtworks(req, res) {
        try {
            const userId = req.body.userId;
            const unlockedItems = await storage_1.UserUnlockedItem.find({
                where: { userId, itemType: 'card_artwork' }
            });
            const artworkIds = unlockedItems.map(i => Number(i.itemId)).filter(id => !Number.isNaN(id));
            if (artworkIds.length === 0) {
                return res.send({ ok: true, artworks: [] });
            }
            const artworks = await storage_1.CardArtwork.find({
                where: { id: (0, typeorm_1.In)(artworkIds) }
            });
            res.send({ ok: true, artworks });
        }
        catch (error) {
            console.error('Error fetching unlocked artworks:', error);
            res.status(500).send({ error: 'Server error' });
        }
    }
}
__decorate([
    (0, controller_1.Post)('/admin/upsert'),
    (0, services_1.AuthToken)(),
    (0, services_2.Validate)({
        id: (0, services_2.check)().isNumber().required(),
        name: (0, services_2.check)().required(),
        cardName: (0, services_2.check)().required(),
        setCode: (0, services_2.check)().required(),
        code: (0, services_2.check)().required(),
        imageUrl: (0, services_2.check)().required(),
        holoType: (0, services_2.check)()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Artworks.prototype, "onUpsertArtwork", null);
__decorate([
    (0, controller_1.Post)('/admin/grant'),
    (0, services_1.AuthToken)(),
    (0, services_2.Validate)({
        artworkId: (0, services_2.check)().isNumber().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Artworks.prototype, "onGrantArtwork", null);
__decorate([
    (0, controller_1.Get)('/unlocked'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Artworks.prototype, "onGetUnlockedArtworks", null);
exports.Artworks = Artworks;
