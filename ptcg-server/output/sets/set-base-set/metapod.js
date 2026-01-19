"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metapod = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metapod extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Metapod';
        this.setNumber = '54';
        this.set = 'BS';
        this.fullName = 'Metapod BS';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Caterpie';
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stiffen',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                text: 'Flip a coin. If heads, prevent all damage done to Metapod during your opponent\'s next turn. (Any other effects of attacks still happen.)',
                damage: 0
            },
            {
                name: 'Stun Spore',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    const player = effect.player;
                    player.marker.addMarker(game_1.PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect &&
            effect.target.marker.hasMarker(game_1.PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(game_1.PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(game_1.PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Metapod = Metapod;
