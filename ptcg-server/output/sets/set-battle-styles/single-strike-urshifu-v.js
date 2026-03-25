"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeUrshifuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SingleStrikeUrshifuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = F;
        this.hp = 220;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Laser Focus',
                cost: [F],
                damage: 0,
                text: 'Search your deck for up to 2 [F] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Impact Blow',
                cost: [F, F, C],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t use Impact Blow.'
            }];
        this.regulationMark = 'E';
        this.set = 'BST';
        this.setNumber = '85';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Single Strike Urshifu V';
        this.fullName = 'Single Strike Urshifu V BST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 2, allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, cardList);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Impact Blow')) {
                player.active.cannotUseAttacksNextTurnPending.push('Impact Blow');
            }
        }
        return state;
    }
}
exports.SingleStrikeUrshifuV = SingleStrikeUrshifuV;
