"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lilligant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Lilligant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Petilil';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bemusing Aroma',
                cost: [G],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed and Poisoned. If tails, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Cut',
                cost: [G, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Lilligant';
        this.fullName = 'Lilligant EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const specialConditions = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED, card_types_1.SpecialCondition.POISONED]);
                    specialConditions.target = opponent.active;
                    store.reduceEffect(state, specialConditions);
                }
                else {
                    (0, attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Lilligant = Lilligant;
