"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidonex = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Miraidonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.FUTURE, card_types_2.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 220;
        this.retreat = [C];
        this.attacks = [{
                name: 'Repulsion Bolt',
                cost: [L, P],
                damage: 60,
                damageCalculator: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 100 more damage.'
            },
            {
                name: 'Cyber Drive',
                cost: [L, P, C],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t use Cyber Drive.'
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.name = 'Miraidon ex';
        this.fullName = 'Miraidon ex TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 100;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Pushed "Cyber Drive" into cannotUseAttacksNextTurnPending if missing.
            //
            // Converted to prefab version (THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN).
            (0, prefabs_1.THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN)(player, this.attacks[1]);
        }
        return state;
    }
}
exports.Miraidonex = Miraidonex;
