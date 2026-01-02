"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VileplumeGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class VileplumeGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = G;
        this.hp = 240;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Fragrant Flower Garden',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may heal 30 damage from each of your Pokémon.',
                useWhenInPlay: true
            }];
        this.attacks = [
            {
                name: 'Massive Bloom',
                cost: [G, C],
                damage: 180,
                damageCalculation: '-',
                text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Allergic Explosion-GX',
                cost: [G],
                damage: 50,
                gxAttack: true,
                text: 'Your opponent\'s Active Pokémon is now Burned, Paralyzed, and Poisoned. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Vileplume-GX';
        this.fullName = 'Vileplume-GX CEC';
        this.FRAGRANT_FLOWER_GARDEN_MARKER = 'FRAGRANT_FLOWER_GARDEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this);
        }
        // Fragrant Flower Garden
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this);
            prefabs_1.ABILITY_USED(player, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                state = store.reduceEffect(state, healEffect);
            });
        }
        // Massive Bloom
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage -= effect.source.damage;
        }
        // Allergic Explosion-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
            prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        return state;
    }
}
exports.VileplumeGX = VileplumeGX;
