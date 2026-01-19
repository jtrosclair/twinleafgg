"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurningEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BurningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Burning Energy';
        this.fullName = 'Burning Energy BKT';
        this.text = `This card can only be attached to [R] Pokémon. This card provides [R] Energy only while this card is attached to a [R] Pokémon.

If this card is discarded by an attack of the [R] Pokémon this card is attached to, attach this card from your discard pile to that Pokémon after attacking.

(If this card is attached to anything other than a [R] Pokémon, discard this card.)`;
        this.BURNING_EXISTANCE_MARKER = 'BURNING_EXISTANCE_MARKER';
        this.BURNING_DISCARDED_MARKER = 'BURNING_DISCARDED_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Provide energy when attached to Fire Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.FIRE)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIRE] });
            }
        }
        // Prevent attaching to non Fire Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FIRE)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card when not attached to Fire Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || (0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, cardList)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FIRE)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.source.cards.includes(this) && effect.player.active === effect.source) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.source)) {
                return state;
            }
            effect.player.marker.addMarker(this.BURNING_EXISTANCE_MARKER, this);
        }
        // checking if this card is discarded while attacking
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.player.marker.hasMarker(this.BURNING_EXISTANCE_MARKER, this)) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.source)) {
                return state;
            }
            effect.player.marker.addMarker(this.BURNING_DISCARDED_MARKER, this);
        }
        // removing the markers and handling the reattaching of it
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BURNING_EXISTANCE_MARKER, this)) {
            effect.player.marker.removeMarker(this.BURNING_EXISTANCE_MARKER, this);
            // if this card was in the discard and triggered that earlier part, move it onto the acitve
            if (effect.player.marker.hasMarker(this.BURNING_DISCARDED_MARKER, this)) {
                effect.player.marker.removeMarker(this.BURNING_DISCARDED_MARKER, this);
                if (effect.player.active !== undefined) {
                    effect.player.discard.cards.forEach(card => {
                        if (card === this) {
                            effect.player.discard.moveCardTo(card, effect.player.active);
                        }
                    });
                }
            }
        }
        return state;
    }
}
exports.BurningEnergy = BurningEnergy;
