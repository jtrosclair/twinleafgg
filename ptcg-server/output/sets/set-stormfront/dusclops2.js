"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusclops2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Dusclops2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duskull';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D, value: +20 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dark One-eye',
                cost: [P],
                damage: 20,
                text: 'You may discard a card from your hand. If you do, your opponent discards a card from his or her hand.'
            },
            {
                name: 'Ambush',
                cost: [P, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 damage plus 20 more damage.'
            }];
        this.set = 'SF';
        this.name = 'Dusclops';
        this.fullName = 'Dusclops SF 34';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    if (player.hand.cards.length > 0) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                            const cards = selected || [];
                            player.hand.moveCardsTo(cards, player.discard);
                        });
                    }
                    if (opponent.hand.cards.length > 0) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                            const cards = selected || [];
                            opponent.hand.moveCardsTo(cards, opponent.discard);
                        });
                    }
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Dusclops2 = Dusclops2;
