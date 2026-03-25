"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shinx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shinx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Big Roar',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
            }];
        this.attacks = [{
                name: 'Ram',
                cost: [L],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Shinx';
        this.fullName = 'Shinx PAL';
        this.BIG_ROAR_MARKER = 'BIG_ROAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.BIG_ROAR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            effect.player.marker.addMarker(this.BIG_ROAR_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            // Legacy implementation:
            // - Used a custom ChoosePokemonPrompt where the opponent chose their replacement Active.
            // - Switched opponent Active to the selected Benched Pokémon.
            //
            // Converted to prefab version (SWITCH_OUT_OPPONENT_ACTIVE_POKEMON).
            return (0, prefabs_1.SWITCH_OUT_OPPONENT_ACTIVE_POKEMON)(store, state, player, { allowCancel: false });
        }
        return state;
    }
}
exports.Shinx = Shinx;
