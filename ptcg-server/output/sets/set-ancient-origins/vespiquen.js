"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vespiquen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vespiquen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Combee';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.attacks = [
            {
                name: 'Intelligence Gathering',
                cost: [C],
                damage: 10,
                text: 'You may draw cards until you have 6 cards in your hand.'
            },
            {
                name: 'Bee Revenge',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each Pokémon in your discard pile.'
            }
        ];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Vespiquen';
        this.fullName = 'Vespiquen AOR';
    }
    reduceEffect(store, state, effect) {
        // Intelligence Gathering
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.length >= 6 || player.deck.cards.length === 0) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
                }
            });
        }
        // Bee Revenge
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let pokemonInDiscard = 0;
            player.discard.cards.forEach(card => {
                if (card instanceof pokemon_card_1.PokemonCard) {
                    pokemonInDiscard++;
                }
            });
            effect.damage += pokemonInDiscard * 10;
        }
        return state;
    }
}
exports.Vespiquen = Vespiquen;
