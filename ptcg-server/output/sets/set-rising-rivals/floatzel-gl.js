"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatzelGL = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FloatzelGL extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Incite',
                cost: [],
                damage: 0,
                text: 'Search your discard pile for up to 2 Supporter cards, show them to your opponent, and put them into your hand.'
            },
            {
                name: 'Giant Wave',
                cost: [W, W],
                damage: 50,
                text: 'Floatzel GL can\'t use Giant Wave during your next turn.'
            }
        ];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Floatzel GL';
        this.fullName = 'Floatzel GL RR';
        this.GIANT_WAVE_MARKER = 'GIANT_WAVE_MARKER';
        this.CLEAR_GIANT_WAVE_MARKER = 'CLEAR_GIANT_WAVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Incite
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasSupporter = player.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
            });
            if (!hasSupporter) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 2, allowCancel: true }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                    prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards });
                }
            });
        }
        // Giant Wave
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (effect.player.marker.hasMarker(this.GIANT_WAVE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.GIANT_WAVE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_GIANT_WAVE_MARKER, this)) {
            effect.player.marker.removeMarker(this.GIANT_WAVE_MARKER, this);
            effect.player.marker.removeMarker(this.CLEAR_GIANT_WAVE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.GIANT_WAVE_MARKER, this)) {
            effect.player.marker.addMarker(this.CLEAR_GIANT_WAVE_MARKER, this);
        }
        return state;
    }
}
exports.FloatzelGL = FloatzelGL;
