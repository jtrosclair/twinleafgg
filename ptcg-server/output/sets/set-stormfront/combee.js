"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Combee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R, value: +10 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Honey',
                powerType: game_1.PowerType.HELD_ITEM,
                text: 'Once during your turn, when you put Combee from your hand onto your Bench, you may search your discard pile for a Basic Pokémon and put it onto your Bench.'
            }];
        this.attacks = [{
                name: 'Alert',
                cost: [C],
                damage: 0,
                text: 'Draw a card. Then, you may switch Combee with 1 of your Benched Pokémon.'
            }];
        this.set = 'SF';
        this.name = 'Combee';
        this.fullName = 'Combee SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            // No cards in discard
            if (player.discard.cards.length === 0) {
                return state;
            }
            // Check if bench has open slots
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            // No open slots
            if (openSlots.length === 0) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: game_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.discard.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
                });
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.DRAW_CARDS(player, 1);
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                }
            });
        }
        return state;
    }
}
exports.Combee = Combee;
