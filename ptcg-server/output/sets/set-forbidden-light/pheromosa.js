"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pheromosa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
// FLI Pheromosa 11 (https://limitlesstcg.com/cards/FLI/11)
class Pheromosa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.attacks = [
            { name: 'High Jump Kick', cost: [card_types_1.CardType.COLORLESS], damage: 20, text: '' },
            { name: 'White Ray', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS], damage: 90, text: 'If you have only 1 Prize card remaining, this attack does 90 more damage.' }
        ];
        this.set = 'FLI';
        this.name = 'Pheromosa';
        this.fullName = 'Pheromosa FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.getPrizeLeft() === 1) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Pheromosa = Pheromosa;
