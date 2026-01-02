"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorina = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidorina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nidoran F';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Fast Evolution',
                cost: [C, C],
                damage: 0,
                text: 'Search your deck for up to 2 Evolution cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
            }
        ];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Nidorina';
        this.fullName = 'Nidorina RG';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 1, this)) {
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== '' && card.stage !== card_types_1.Stage.LV_X) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 2, blocked });
        }
        return state;
    }
}
exports.Nidorina = Nidorina;
