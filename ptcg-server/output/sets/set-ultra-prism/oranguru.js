"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oranguru = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Oranguru extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Resource Management',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 3 cards from your discard pile on the bottom of your deck in any order.'
            },
            {
                name: 'Profound Knowledge',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
        ];
        this.set = 'UPR';
        this.setNumber = '114';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oranguru';
        this.fullName = 'Oranguru UPR';
    }
    reduceEffect(store, state, effect) {
        // Resource Management
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_DISCARD_EMPTY)(player);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: 3, allowCancel: false }), selected => {
                cards = selected || [];
                player.discard.moveCardsTo(cards, player.deck);
            });
        }
        // Profound Knowledge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.CONFUSED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Oranguru = Oranguru;
