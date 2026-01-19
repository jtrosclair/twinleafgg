"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ariados = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Ariados extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spinarak';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Poisonous Nest',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may use this Ability. Both Active Pokémon (except for [G] Pokémon) are now Poisoned.'
            }];
        this.attacks = [{
                name: 'Impound',
                cost: [G, C],
                damage: 30,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'AOR';
        this.name = 'Ariados';
        this.fullName = 'Ariados AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.POISONOUS_NEST_MARKER = 'POISONOUS_NEST_MARKER';
    }
    reduceEffect(store, state, effect) {
        //Ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.POISONOUS_NEST_MARKER, player, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if the Pokémon is Grass
            const checkPokemonTypeEffectPlayer = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffectPlayer);
            const isGrassPokemonPlayer = checkPokemonTypeEffectPlayer.cardTypes.includes(card_types_1.CardType.GRASS);
            const checkPokemonTypeEffectOpponent = new check_effects_1.CheckPokemonTypeEffect(opponent.active);
            store.reduceEffect(state, checkPokemonTypeEffectOpponent);
            const isGrassPokemonOpponent = checkPokemonTypeEffectOpponent.cardTypes.includes(card_types_1.CardType.GRASS);
            if (!isGrassPokemonPlayer) {
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, player, this);
            }
            if (!isGrassPokemonOpponent) {
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            }
            (0, prefabs_1.ADD_MARKER)(this.POISONOUS_NEST_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.POISONOUS_NEST_MARKER, player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        //Marker remover
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if ((0, prefabs_1.HAS_MARKER)(this.POISONOUS_NEST_MARKER, effect.player, this)) {
                (0, prefabs_1.REMOVE_MARKER)(this.POISONOUS_NEST_MARKER, effect.player, this);
            }
        }
        return state;
    }
}
exports.Ariados = Ariados;
