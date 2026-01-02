"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OranguruV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class OranguruV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 210;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Back Order',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may search your deck for up to 2 Pokémon Tool cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Psychic',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.setNumber = '133';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oranguru V';
        this.fullName = 'Oranguru V ASR';
        this.BACK_ORDER_MARKER = 'BACK_ORDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BACK_ORDER_MARKER, this);
        }
        // Back Order
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.BACK_ORDER_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (!(c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL)) {
                    blocked.push(index);
                }
            });
            prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false, blocked }, this.powers[0]);
        }
        // Psychic
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 50;
        }
        // marker gaming
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BACK_ORDER_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.BACK_ORDER_MARKER, this);
        }
        return state;
    }
}
exports.OranguruV = OranguruV;
