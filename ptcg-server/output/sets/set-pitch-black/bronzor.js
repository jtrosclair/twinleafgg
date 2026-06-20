"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bronzor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Mirror Attack',
                cost: [M],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a [M] Pokémon, this attack does 30 more damage.',
            }];
        this.set = 'M5';
        this.setNumber = '61';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bronzor';
        this.fullName = 'Bronzor M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponentActive = effect.opponent.active;
            const ctype = new check_effects_1.CheckPokemonTypeEffect(opponentActive);
            store.reduceEffect(state, ctype);
            if (ctype.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Bronzor = Bronzor;
