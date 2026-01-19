"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skitty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_1 = require("../../game");
class Skitty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Important Errands',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a React Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Jump On',
                cost: [C, C],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
            }];
        this.set = 'LM';
        this.name = 'Skitty';
        this.fullName = 'Skitty LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { name: 'React Energy' }, { min: 0, max: 1, allowCancel: false }), cards => {
                if (cards.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Skitty = Skitty;
