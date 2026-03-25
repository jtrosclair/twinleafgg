"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Beldum';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Metal Maker',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top 4 cards of your deck and attach any number of [M] Energy you find there to your Pokémon in any way you like. Shuffle the other cards and put them at the bottom of your deck.'
            }];
        this.attacks = [{
                name: 'Beam',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.name = 'Metang';
        this.fullName = 'Metang TEF';
        this.METAL_MAKER_MARKER = 'METAL_MAKER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.METAL_MAKER_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.METAL_MAKER_MARKER, this)) {
            effect.player.marker.removeMarker(this.METAL_MAKER_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.METAL_MAKER_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Legacy implementation:
            // - Took top 4 into a temporary CardList.
            // - Allowed attaching found Metal Energy to your Pokémon.
            // - Put the remaining cards on the bottom of deck.
            // - Set once-per-turn marker and board effect in both attach/non-attach paths.
            //
            // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY).
            player.marker.addMarker(this.METAL_MAKER_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            return (0, prefabs_1.LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY)(store, state, player, 4, 4, {
                validCardTypes: [card_types_1.CardType.METAL],
                remainderDestination: 'bottom'
            });
        }
        return state;
    }
}
exports.Metang = Metang;
