"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ambipom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Ambipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Aipom';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nice-Nice Catch',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Bye-Bye Throw',
                cost: [C, C],
                damage: 0,
                text: 'Discard up to 2 cards from your hand. This attack does 60 damage for each card you discarded in this way.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '170';
        this.name = 'Ambipom';
        this.fullName = 'Ambipom CEC';
    }
    reduceEffect(store, state, effect) {
        // Nice-Nice Catch attack - Draw 2 cards
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        // Bye-Bye Throw attack - Discard up to 2 cards for 60 damage each
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Prompt player to choose up to 2 cards to discard from hand
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 0, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                // Calculate damage: 60 per card discarded
                const damage = cards.length * 60;
                effect.damage = damage;
                return state;
            });
        }
        return state;
    }
}
exports.Ambipom = Ambipom;
