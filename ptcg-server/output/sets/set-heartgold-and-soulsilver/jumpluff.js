"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Skiploom';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Mass Attack',
                cost: [G],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the number of Pokémon in play (both yours and your opponent\'s).'
            },
            {
                name: 'Leaf Guard',
                cost: [G],
                damage: 30,
                text: 'During your opponent\'s next turn, any damage done to Jumpluff by attacks is reduced by 30 (after applying Weakness and Resistance).'
            }];
        this.set = 'HS';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.LEAF_GUARD_MARKER = 'LEAF_GUARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, () => { pokemonInPlay += 1; });
            effect.damage = 10 * pokemonInPlay;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.ADD_MARKER)(this.LEAF_GUARD_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && (0, prefabs_1.HAS_MARKER)(this.LEAF_GUARD_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 30;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
            (0, prefabs_1.REMOVE_MARKER)(this.LEAF_GUARD_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Jumpluff = Jumpluff;
