"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tropius = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Tropius extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Return',
                cost: [G],
                damage: 10,
                text: 'Draw cards until you have 6 cards in your hand.'
            },
            {
                name: 'Energy Press',
                cost: [G, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 more damage for each Energy attached to the Defending Pok\u00e9mon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tropius';
        this.fullName = 'Tropius PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND)(6, effect, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
            effect.damage += 20 * energyCount;
        }
        return state;
    }
}
exports.Tropius = Tropius;
