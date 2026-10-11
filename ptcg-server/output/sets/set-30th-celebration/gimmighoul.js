"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gimmighoul = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gimmighoul extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Strolls So Much',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a card and put it into your hand. Then, shuffle your deck.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Gimmighoul';
        this.fullName = 'Gimmighoul 30C';
    }
    reduceEffect(store, state, effect) {
        // Strolls So Much
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    if (player.deck.cards.length === 0) {
                        return;
                    }
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected && selected.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selected, sourceCard: this });
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
            });
        }
        return state;
    }
}
exports.Gimmighoul = Gimmighoul;
