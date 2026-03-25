"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Accelgor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [{
                name: 'Hammer In',
                cost: [G],
                damage: 20,
                text: ''
            }, {
                name: 'Deck and Cover',
                cost: [C, C],
                damage: 50,
                text: 'The Defending Pokémon is now Paralyzed and Poisoned. Shuffle this ' +
                    'Pokémon and all cards attached to it into your deck.'
            }];
        this.set = 'DEX';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        // Deck and Cover - apply special conditions during attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [
                card_types_1.SpecialCondition.PARALYZED,
                card_types_1.SpecialCondition.POISONED
            ]);
            store.reduceEffect(state, addSpecialCondition);
        }
        // Deck and Cover - shuffle self into deck after attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            return (0, attack_effects_2.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK)(store, state, effect);
        }
        return state;
    }
}
exports.Accelgor = Accelgor;
