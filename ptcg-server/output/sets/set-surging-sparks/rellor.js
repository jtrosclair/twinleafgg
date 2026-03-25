"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rellor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rellor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Collect', cost: [card_types_1.CardType.COLORLESS], damage: 0, text: 'Draw a card.' },
            { name: 'Rollout', cost: [card_types_1.CardType.GRASS], damage: 10, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Rellor';
        this.fullName = 'Rellor SSP';
        this.setNumber = '13';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Collect
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    }
}
exports.Rellor = Rellor;
