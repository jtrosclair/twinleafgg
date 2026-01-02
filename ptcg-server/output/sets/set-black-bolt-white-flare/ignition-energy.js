"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnitionEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class IgnitionEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Ignition Energy';
        this.fullName = 'Ignition Energy SV11W';
        this.text = `If this card is attached to 1 of your Pokémon, discard it at the end of the turn.

This card provides 1 [C] Energy while it is attached to a Pokémon.

If this card is attached to an Evolution Pokémon, it provides [C][C][C] Energy instead.`;
        this.IGNITION_ENERGY_MARKER = 'IGNITION_ENERGY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            effect.player.marker.addMarker(this.IGNITION_ENERGY_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const attachedTo = effect.source.getPokemonCard();
            if (!!attachedTo && attachedTo instanceof pokemon_card_1.PokemonCard && attachedTo.stage == card_types_1.Stage.BASIC) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            if (!!attachedTo && attachedTo instanceof pokemon_card_1.PokemonCard && attachedTo.stage !== card_types_1.Stage.BASIC && attachedTo.stage !== card_types_1.Stage.RESTORED) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS] });
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.IGNITION_ENERGY_MARKER, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    effect.player.marker.removeMarker(this.IGNITION_ENERGY_MARKER, this);
                }
            });
        }
        return state;
    }
}
exports.IgnitionEnergy = IgnitionEnergy;
