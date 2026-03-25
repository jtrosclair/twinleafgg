"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Xerneas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Lead',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Bright Horns',
                cost: [Y, Y, Y],
                damage: 130,
                text: 'This Pokémon can\'t use Bright Horns during your next turn.'
            }];
        this.set = 'CIN';
        this.name = 'Xerneas';
        this.fullName = 'Xerneas CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        cards.forEach((card, index) => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Bright Horns
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Bright Horns')) {
                player.active.cannotUseAttacksNextTurnPending.push('Bright Horns');
            }
        }
        return state;
    }
}
exports.Xerneas = Xerneas;
