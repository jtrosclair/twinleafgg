"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BoostEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Boost Energy';
        this.fullName = 'Boost Energy AQ';
        this.text = 'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat.\n\nWhen the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';
        this.BOOST_MARKER = 'BOOST_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            if (effect.target.getPokemons().length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.player.marker.addMarker(this.BOOST_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const attachedTo = effect.source.getPokemonCard();
            if (!!attachedTo && attachedTo instanceof pokemon_card_1.PokemonCard && effect.source.getPokemons().length > 1) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS] });
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.BOOST_MARKER, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.includes(this)) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, game_1.StateUtils.findCardList(state, this), player.discard, { cards: [this], sourceCard: this });
                    effect.player.marker.removeMarker(this.BOOST_MARKER, this);
                }
            });
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && cardList.getPokemons().length < 2) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, game_1.StateUtils.findCardList(state, this), player.discard, { cards: [this] });
                    }
                });
            });
            return state;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        return state;
    }
}
exports.BoostEnergy = BoostEnergy;
