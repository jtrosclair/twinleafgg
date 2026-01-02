"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Data Sort',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, choose a Trainer card from your discard pile, show it to your opponent, and then shuffle it into your deck.'
            },
            {
                name: 'Peck',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Porygon';
        this.fullName = 'Porygon AQ';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, (result) => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                        if (selected) {
                            prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);
                            prefabs_1.MOVE_CARDS(store, state, player.discard, player.deck, { cards: selected, sourceCard: this, sourceEffect: this.attacks[0] });
                            prefabs_1.SHUFFLE_DECK(store, state, player);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Porygon = Porygon;
