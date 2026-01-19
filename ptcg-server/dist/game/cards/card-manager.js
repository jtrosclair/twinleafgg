"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardManager = void 0;
const utils_1 = require("../../utils/utils");
class CardManager {
    constructor() {
        this.cards = [];
        this.cardIndex = {};
    }
    static getInstance() {
        if (!CardManager.instance) {
            CardManager.instance = new CardManager();
        }
        return CardManager.instance;
    }
    defineSet(set) {
        for (const card of set) {
            if (this.cardIndex[card.fullName] !== undefined) {
                throw new Error('Multiple cards with the same name: ' + card.fullName);
            }
            const index = this.cards.length;
            this.cards.push(card);
            this.cardIndex[card.fullName] = index;
            const p = card;
            if (p.legacyFullName) {
                if (this.cardIndex[p.legacyFullName] !== undefined) {
                    throw new Error('Multiple cards with the same name: ' + p.legacyFullName);
                }
                this.cardIndex[p.legacyFullName] = index;
            }
        }
    }
    loadCardsInfo(cardsInfo) {
        this.cardIndex = {};
        this.cards = cardsInfo.cards;
        for (let i = 0; i < this.cards.length; i++) {
            this.cardIndex[this.cards[i].fullName] = i;
        }
    }
    defineCard(card) {
        this.cards.push(card);
    }
    getCardByName(name) {
        const index = this.cardIndex[name];
        if (index !== undefined) {
            return (0, utils_1.deepClone)(this.cards[index]);
        }
    }
    isCardDefined(name) {
        return this.cardIndex[name] !== undefined;
    }
    getAllCards() {
        return this.cards;
    }
}
exports.CardManager = CardManager;
