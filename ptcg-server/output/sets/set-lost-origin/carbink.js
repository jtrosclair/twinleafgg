"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carbink = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Carbink extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Lucky Find',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Power Gem',
                cost: [F, C, C],
                damage: 80,
                text: ''
            }];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Carbink';
        this.fullName = 'Carbink LOR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 2, allowCancel: false }), selected => {
                if (selected) {
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);
                    prefabs_1.MOVE_CARDS(store, state, player.deck, player.hand, { cards: selected });
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                }
            });
        }
        return state;
    }
}
exports.Carbink = Carbink;
