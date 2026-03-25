"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palpitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Palpitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tympole';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Bubble Beam',
                cost: [W, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Palpitoad';
        this.fullName = 'Palpitoad DEX';
    }
    reduceEffect(store, state, effect) {
        // Bubble Beam - flip coin for Paralysis
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Palpitoad = Palpitoad;
