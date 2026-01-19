"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Stiffen',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, any damage done to Porygon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            },
            {
                name: 'Version Update',
                cost: [C, C],
                damage: 0,
                text: 'Search your deck for Porygon2, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.set = 'HSP';
        this.name = 'Porygon';
        this.fullName = 'Porygon HSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.STIFFEN_MARKER = 'STIFFEN_MARKER';
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
            (0, prefabs_1.ADD_MARKER)(this.STIFFEN_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && (0, prefabs_1.HAS_MARKER)(this.STIFFEN_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 20;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
            (0, prefabs_1.REMOVE_MARKER)(this.STIFFEN_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, { name: 'Porygon2' });
        }
        return state;
    }
}
exports.Porygon = Porygon;
