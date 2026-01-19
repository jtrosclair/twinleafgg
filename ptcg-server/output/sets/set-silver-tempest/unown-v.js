"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class UnownV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 180;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Shady Stamp',
                cost: [P],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Victory Symbol',
                cost: [C, C, C],
                damage: 0,
                text: 'If you use this attack when you have only 1 Prize card remaining, you win this game.'
            },
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Unown V';
        this.fullName = 'Unown V SIT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
        }
        // Star Cipher
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const owner = state.activePlayer;
            if (player.getPrizeLeft() === 1) {
                if (owner === 0) {
                    state = (0, check_effect_1.endGame)(store, state, game_1.GameWinner.PLAYER_1);
                }
                if (owner === 1) {
                    state = (0, check_effect_1.endGame)(store, state, game_1.GameWinner.PLAYER_2);
                }
            }
        }
        return state;
    }
}
exports.UnownV = UnownV;
