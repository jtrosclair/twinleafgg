"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volbeat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Volbeat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = card_types_1.CardType.GRASS;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Luring Glow',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
            },
            {
                name: 'Bug Buzz',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Volbeat';
        this.fullName = 'Volbeat 30C';
    }
    reduceEffect(store, state, effect) {
        // Luring Glow
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            return (0, prefabs_1.SWITCH_IN_OPPONENT_BENCHED_POKEMON)(store, state, effect.player, {
                allowCancel: false,
                sourceEffect: effect,
            });
        }
        return state;
    }
}
exports.Volbeat = Volbeat;
