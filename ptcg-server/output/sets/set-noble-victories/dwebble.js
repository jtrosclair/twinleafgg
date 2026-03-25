"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dwebble = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Dwebble extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Withdraw',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to this Pokémon by attacks during your opponent\'s next turn.'
            },
            {
                name: 'Slash',
                cost: [G, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NVI';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dwebble';
        this.fullName = 'Dwebble NVI';
        this.WITHDRAW_MARKER = 'WITHDRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Withdraw - flip coin, if heads prevent damage next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                        if (cardList.getPokemonCard() === this) {
                            (0, prefabs_1.ADD_MARKER)(this.WITHDRAW_MARKER, cardList, this);
                        }
                    });
                }
            });
        }
        // Block damage if marker is present
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            if ((0, prefabs_1.HAS_MARKER)(this.WITHDRAW_MARKER, effect.target, this)) {
                effect.damage = 0;
            }
        }
        // Remove marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    (0, prefabs_1.REMOVE_MARKER)(this.WITHDRAW_MARKER, cardList, this);
                }
            });
        }
        return state;
    }
}
exports.Dwebble = Dwebble;
