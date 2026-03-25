"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beedrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beedrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kakuna';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R, value: +30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Flutter Wings',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your deck for a [G] Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Beedrill is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Needle Shock',
                cost: [G, C, C],
                damage: 30,
                text: 'The Defending Pokémon is now Paralyzed and Poisoned. Ignore this effect if any of your Pokémon used Needle Shock during your last turn.'
            }];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill RR';
        this.FLUTTER_WINGS_MARKER = 'FLUTTER_WINGS_MARKER';
        this.NEEDLE_SHOCK_MARKER = 'NEEDLE_SHOCK_MARKER';
        this.CLEAR_NEEDLE_SHOCK_MARKER = 'CLEAR_NEEDLE_SHOCK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLUTTER_WINGS_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FLUTTER_WINGS_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.FLUTTER_WINGS_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.FLUTTER_WINGS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, { cardType: card_types_1.CardType.GRASS }, { min: 0, max: 1, allowCancel: false });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (!effect.player.marker.hasMarker(this.NEEDLE_SHOCK_MARKER, this)) {
                (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
            }
            effect.player.marker.addMarker(this.NEEDLE_SHOCK_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_NEEDLE_SHOCK_MARKER, this)) {
            effect.player.marker.removeMarker(this.NEEDLE_SHOCK_MARKER, this);
            effect.player.marker.removeMarker(this.CLEAR_NEEDLE_SHOCK_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NEEDLE_SHOCK_MARKER, this)) {
            effect.player.marker.addMarker(this.CLEAR_NEEDLE_SHOCK_MARKER, this);
        }
        return state;
    }
}
exports.Beedrill = Beedrill;
