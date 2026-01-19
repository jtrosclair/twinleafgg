"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zygarde = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zygarde extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = N;
        this.hp = 130;
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Bite',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Judgement Surge',
                cost: [G, F, C],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon for each Prize card your opponent has taken. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Zygarde';
        this.fullName = 'Zygarde EVS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(40 * effect.opponent.prizesTaken, effect, store, state);
        }
        return state;
    }
}
exports.Zygarde = Zygarde;
