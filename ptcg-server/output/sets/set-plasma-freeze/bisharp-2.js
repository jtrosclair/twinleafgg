"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Bisharp2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Cut Down',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Slicing Blade',
                cost: [D, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp PLF 74';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Bisharp2 = Bisharp2;
