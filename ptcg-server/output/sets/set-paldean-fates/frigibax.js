"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frigibax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Frigibax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Collect',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PAF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Frigibax';
        this.fullName = 'Frigibax PAF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Frigibax = Frigibax;
