"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggcute = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Exeggcute extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = card_types_1.CardType.GRASS;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hypnosis',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Exeggcute';
        this.fullName = 'Exeggcute 30C';
    }
    reduceEffect(store, state, effect) {
        // Hypnosis
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Exeggcute = Exeggcute;
