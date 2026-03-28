"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowthex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowthex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 170;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Last-Ditch Catch',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand to your Bench during your turn, you may use this Ability. Search your deck for a Supporter card, reveal it, and put it into your hand. You can\'t use this Ability if you\'ve already used another Ability with "Last-Ditch" in its name this turn.',
            }];
        this.attacks = [{
                name: 'Tuck Tail',
                cost: [C, C, C],
                damage: 60,
                text: 'Return this Pokémon and all attached cards into your hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Meowth ex';
        this.fullName = 'Meowth ex POR';
        this.TRUMP_CARD_MARKER = 'TRUMP_CARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            if (player.marker.hasMarker(this.TRUMP_CARD_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.TrainerCard && (card.trainerType !== card_types_1.TrainerType.SUPPORTER)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    player.marker.addMarkerToState(this.TRUMP_CARD_MARKER);
                    (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.powers[0]);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TRUMP_CARD_MARKER)) {
            effect.player.marker.removeMarker(this.TRUMP_CARD_MARKER);
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemons = player.active.getPokemons();
            const otherCards = player.active.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !pokemons.includes(card) &&
                (!player.active.tools || !player.active.tools.includes(card)));
            const tools = [...player.active.tools];
            player.active.clearEffects();
            // Move other cards to hand
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: otherCards });
            }
            // Move tools to hand explicitly
            for (const tool of tools) {
                player.active.moveCardTo(tool, player.hand);
            }
            // Move Pokémon to hand
            if (pokemons.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: pokemons });
            }
            return state;
        }
        return state;
    }
}
exports.Meowthex = Meowthex;
