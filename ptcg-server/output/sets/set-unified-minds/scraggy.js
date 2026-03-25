"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraggy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Scraggy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Swagger',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Whap Down',
                cost: [D, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '137';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scraggy';
        this.fullName = 'Scraggy UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Swagger
        // Ref: AGENTS-patterns.md (coin flip + discard energy from opponent)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Scraggy = Scraggy;
