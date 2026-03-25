"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cubchoo = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Cubchoo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powder Snow',
                cost: [W],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            },
            {
                name: 'Rest',
                cost: [C, C],
                damage: 0,
                text: 'Heal 60 damage from this Pokémon. This Pokémon is now Asleep.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Cubchoo';
        this.fullName = 'Cubchoo EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(60, effect, store, state);
            const specialCondition = new attack_effects_2.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            specialCondition.target = player.active;
            store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Cubchoo = Cubchoo;
