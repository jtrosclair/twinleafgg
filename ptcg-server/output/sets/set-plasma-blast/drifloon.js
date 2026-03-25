"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifloon = void 0;
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Drifloon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Creepy Wind',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Wind Blast',
                cost: [C, C, C],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Drifloon';
        this.fullName = 'Drifloon PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(40, effect, store, state);
        }
        return state;
    }
}
exports.Drifloon = Drifloon;
