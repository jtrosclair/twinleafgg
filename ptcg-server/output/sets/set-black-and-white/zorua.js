"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zorua = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zorua extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Lunge',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'BLW';
        this.name = 'Zorua';
        this.fullName = 'Zorua BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Zorua = Zorua;
