"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croconaw = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Croconaw extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Sweep Away',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Discard the top 3 cards of your deck.'
            }
        ];
        this.set = 'DRM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Croconaw';
        this.fullName = 'Croconaw DRM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Discard 3 cards from your deck 
            player.deck.moveTo(player.discard, 3);
            return state;
        }
        return state;
    }
}
exports.Croconaw = Croconaw;
