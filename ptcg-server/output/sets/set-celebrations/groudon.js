"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groudon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Groudon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Magma Volcano',
                cost: [F, F, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Discard the top 5 cards of your deck. This attack does 80 damage for each Energy card you discarded in this way.'
            },
            {
                name: 'Massive Rend',
                cost: [F, F, C, C],
                damage: 120,
                text: ''
            }];
        this.set = 'CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Groudon';
        this.fullName = 'Groudon CEL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            // Move top 5 cards from deckTop
            player.deck.moveTo(deckTop, 5);
            // Filter for Energy cards
            const energyCount = deckTop.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            // Move all cards to discard
            deckTop.moveTo(player.discard, deckTop.cards.length);
            effect.damage = energyCount.length * 80;
        }
        return state;
    }
}
exports.Groudon = Groudon;
