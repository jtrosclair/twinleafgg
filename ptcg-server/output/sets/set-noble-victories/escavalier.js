"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Escavalier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Escavalier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Karrablast';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Slash',
                cost: [M, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Guard Press',
                cost: [M, C, C],
                damage: 60,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Escavalier';
        this.fullName = 'Escavalier NVI';
        this.GUARD_PRESS_MARKER = 'GUARD_PRESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Guard Press - add marker for damage reduction
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    (0, prefabs_1.ADD_MARKER)(this.GUARD_PRESS_MARKER, cardList, this);
                }
            });
        }
        // Reduce damage if marker is present
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            if ((0, prefabs_1.HAS_MARKER)(this.GUARD_PRESS_MARKER, effect.target, this)) {
                effect.damage = Math.max(0, effect.damage - 20);
            }
        }
        // Remove marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    (0, prefabs_1.REMOVE_MARKER)(this.GUARD_PRESS_MARKER, cardList, this);
                }
            });
        }
        return state;
    }
}
exports.Escavalier = Escavalier;
