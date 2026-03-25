"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mienshao = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class Mienshao extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mienfoo';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Haul In',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 2 Pokémon Tool cards, reveal them, and put them into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Meditate',
                cost: [F, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on the Defending Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '68';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mienshao';
        this.fullName = 'Mienshao NXD';
    }
    reduceEffect(store, state, effect) {
        // Haul In - search for 2 Pokémon Tool cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Find blocked indices (non-Tool trainer cards)
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof trainer_card_1.TrainerCard) || card.trainerType !== card_types_1.TrainerType.TOOL) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: true, blocked }), (selected) => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    cards.forEach(card => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                }
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Meditate - bonus damage for each damage counter on defender
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damageCounters = Math.floor(opponent.active.damage / 10);
            effect.damage += damageCounters * 10;
        }
        return state;
    }
}
exports.Mienshao = Mienshao;
