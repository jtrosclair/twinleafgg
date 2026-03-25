"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsSigilyph = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class NsSigilyph extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psychic Sphere',
                cost: [P],
                damage: 20,
                text: ''
            },
            {
                name: 'Victory Symbol',
                cost: [P, C, C],
                damage: 0,
                text: 'If you use this attack when you have exactly 1 Prize card remaining, you win this game. '
            }
        ];
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'N\'s Sigilyph';
        this.fullName = 'N\'s Sigilyph JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const owner = state.activePlayer;
            if (player.getPrizeLeft() === 6) {
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
exports.NsSigilyph = NsSigilyph;
