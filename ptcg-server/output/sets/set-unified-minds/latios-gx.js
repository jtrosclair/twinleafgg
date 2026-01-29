"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatiosGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LatiosGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = P;
        this.hp = 170;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.powers = [{
                name: 'Power Bind',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have 4 or fewer Pokémon in play, this Pokémon can\'t attack.'
            }];
        this.attacks = [
            {
                name: 'Tag Purge',
                cost: [P, C, C],
                damage: 120,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from TAG TEAM Pokémon.'
            },
            {
                name: 'Clear Vision-GX',
                cost: [P],
                damage: 0,
                text: 'For the rest of this game, your opponent can\'t use any GX attacks. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Latios-GX';
        this.fullName = 'Latios-GX UNM';
        this.TAG_PURGE_MARKER = 'TAG_PURGE_MARKER';
        this.CLEAR_TAG_PURGE_MARKER = 'CLEAR_TAG_PURGE_MARKER';
        this.CLEAR_VISION_GX_MARKER = 'CLEAR_VISION_GX_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Power Bind: If you have 4 or fewer Pokémon in play, this Pokémon can't attack.
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            let pokemonInPlay = 0;
            // Count active Pokemon
            if (player.active.cards.length > 0) {
                pokemonInPlay++;
            }
            // Count benched Pokemon
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    pokemonInPlay++;
                }
            });
            if (pokemonInPlay <= 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        // Tag Purge attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.TAG_PURGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_TAG_PURGE_MARKER, this);
        }
        // Prevent damage from TAG TEAM Pokemon during opponent's next turn
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.TAG_PURGE_MARKER)) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.TAG_TEAM)) {
                effect.preventDefault = true;
            }
        }
        // Clear Tag Purge marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TAG_PURGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_TAG_PURGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.TAG_PURGE_MARKER, this);
            });
        }
        // Clear Vision-GX attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // Set GX attack as used for game
            player.usedGX = true;
            // Mark opponent so they can't use GX attacks for the rest of the game
            opponent.marker.addMarker(this.CLEAR_VISION_GX_MARKER, this);
        }
        // Block opponent's GX attacks for the rest of the game
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            // Check if this player is marked with Clear Vision GX
            if (player.marker.hasMarker(this.CLEAR_VISION_GX_MARKER, this)) {
                // Check if the attack is a GX attack (contains "-GX" in the name)
                if (effect.attack.name.includes('-GX')) {
                    throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
                }
            }
        }
        return state;
    }
}
exports.LatiosGX = LatiosGX;
