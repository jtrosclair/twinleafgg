"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_1 = require("../../game/store/state/state");
class SplashEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Splash Energy';
        this.fullName = 'Splash Energy BKP';
        this.text = 'This card can only be attached to [W] Pokémon. This card provides [W] Energy only while this card is attached to a [W] Pokémon.' +
            '\n\n' +
            'If the [W] Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put that Pokémon into your hand. (Discard all cards attached to it.)' +
            '\n\n' +
            '(If this card is attached to anything other than a [W] Pokémon, discard this card.)';
        this.SPLASH_ENERGY_MARKER = 'SPLASH_ENERGY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Provide energy when attached to Water Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.WATER] });
            }
        }
        // Prevent attaching to non Water Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card when not attached to Water Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER)) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { sourceCard: this, sourceEffect: this });
                    }
                });
            });
        }
        // Rescue Pokemon when KO'd by opponent's attack damage;
        if (effect instanceof game_effects_1.KnockOutEffect &&
            effect.target.cards.includes(this) &&
            state.phase === state_1.GamePhase.ATTACK &&
            effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const knockedPokemonOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (!prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, knockedPokemonOwner, this, effect.target)) {
                const cards = effect.target.getPokemons();
                cards.forEach(card => {
                    knockedPokemonOwner.marker.addMarker(this.SPLASH_ENERGY_MARKER, card);
                });
            }
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.SPLASH_ENERGY_MARKER)) {
                    return;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.SPLASH_ENERGY_MARKER)
                    .map(m => m.source)
                    .filter((card) => !!card);
                prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: rescued, sourceCard: this, sourceEffect: this });
                player.marker.removeMarker(this.SPLASH_ENERGY_MARKER);
            });
        }
        return state;
    }
}
exports.SplashEnergy = SplashEnergy;
