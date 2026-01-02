"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magikarp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magikarp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Lively Grouping',
                cost: [C],
                damage: 0,
                text: 'Search your deck for any number of Magikarp, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Raging Fin',
                cost: [C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Magikarp and Gyarados in your discard pile.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Magikarp';
        this.fullName = 'Magikarp PGO';
    }
    reduceEffect(store, state, effect) {
        // Lively Grouping
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, name: 'Magikarp' }, { min: 0, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    player.deck.moveCardsTo(selected, player.hand);
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, effect.opponent, selected);
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                }
                else {
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                }
            });
        }
        // Raging Fin
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let karpsInDiscard = 0;
            player.discard.cards.forEach(card => {
                if (card instanceof pokemon_card_1.PokemonCard && (card.name === 'Magikarp' || card.name === 'Gyarados')) {
                    karpsInDiscard++;
                }
            });
            effect.damage += karpsInDiscard * 30;
        }
        return state;
    }
}
exports.Magikarp = Magikarp;
