"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Honchkrow = void 0;
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Honchkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Murkrow';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: L, value: +20 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Darkness Restore',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Honchkrow is your Active Pokémon and your opponent\'s Bench isn\'t full, you may use this power. Search your opponent\'s discard pile for a Basic Pokémon and put it onto his or her bench. This power can\'t be used if Honchkrow is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Riot',
                cost: [D, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 30 damage plus 10 more damage for each Pokémon that isn\'t an evolved Pokémon in play (both yours and your opponent\'s).'
            }];
        this.set = 'SV';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Honchkrow';
        this.fullName = 'Honchkrow SV';
        this.DARKNESS_RESTORE_MARKER = 'DARKNESS_RESTORE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DARKNESS_RESTORE_MARKER, this);
            return state;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            if (player.marker.hasMarker(this.DARKNESS_RESTORE_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER); // Not active
            }
            const openSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (opponent.discard.cards.filter(card => card instanceof pokemon_card_1.PokemonCard && card.stage === card_types_1.Stage.BASIC).length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH, opponent.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.discard, slots[index], { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                player.marker.addMarker(this.DARKNESS_RESTORE_MARKER, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.DARKNESS_RESTORE_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let unevolvedCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (!list.isEvolved()) {
                    unevolvedCount++;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card) => {
                if (!list.isEvolved()) {
                    unevolvedCount++;
                }
            });
            effect.damage += 10 * unevolvedCount;
        }
        return state;
    }
}
exports.Honchkrow = Honchkrow;
