"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Crobat extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Golbat';
        this.hp = 90;
        this.cardType = G;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.attacks = [{
                name: 'Flutter Trick',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, look at your opponent\'s hand and choose 1 card. Your opponent discards the card you chose.'
            },
            {
                name: 'Triple Poison',
                cost: [G, C],
                damage: 10,
                text: 'The Defending Pokémon is now Poisoned. Put 3 damage counters instead of 1 on the Defending Pokémon between turns.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Crobat';
        this.fullName = 'Crobat HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    if (opponent.hand.cards.length == 0) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1 }), selectedCard => {
                        const selected = selectedCard || [];
                        if (selectedCard === null || selected.length === 0) {
                            return;
                        }
                        (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.discard, { cards: selected, sourceEffect: this.attacks[0] });
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            addSpecialCondition.poisonDamage = 30;
            store.reduceEffect(state, addSpecialCondition);
        }
        return state;
    }
}
exports.Crobat = Crobat;
