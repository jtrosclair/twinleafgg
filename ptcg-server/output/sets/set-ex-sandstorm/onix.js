"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Onix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Bind',
                cost: [C, C],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Rage',
                cost: [F, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 10 damage plus 10 more damage for each damage counter on Onix.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Onix';
        this.fullName = 'Onix SS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage += effect.player.active.damage;
        }
        return state;
    }
}
exports.Onix = Onix;
