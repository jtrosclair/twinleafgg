"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relicanth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
class Relicanth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Fossil Hunt',
                cost: [C],
                damage: 0,
                text: 'Put 2 Item cards that have Fossil in their names from your discard pile into your hand.'
            },
            {
                name: 'Water Gun',
                cost: [W, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Relicanth';
        this.fullName = 'Relicanth PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if there are any Fossil items in discard
            const fossilItems = player.discard.cards.filter(c => c instanceof trainer_card_1.TrainerCard &&
                c.trainerType === card_types_1.TrainerType.ITEM &&
                c.name.includes('Fossil'));
            if (fossilItems.length === 0) {
                return state;
            }
            // Build blocked list for non-Fossil items
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (!(c instanceof trainer_card_1.TrainerCard) ||
                    c.trainerType !== card_types_1.TrainerType.ITEM ||
                    !c.name.includes('Fossil')) {
                    blocked.push(index);
                }
            });
            const max = Math.min(2, fossilItems.length);
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: max, max, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                cards.forEach(card => {
                    player.discard.moveCardTo(card, player.hand);
                });
                if (cards.length > 0) {
                    store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                }
            });
        }
        return state;
    }
}
exports.Relicanth = Relicanth;
