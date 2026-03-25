"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anorith = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Anorith extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Claw Fossil';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fast Evolution',
                cost: [C],
                damage: 0,
                text: 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Pierce',
                cost: [F, C],
                damage: 30,
                text: ''
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Anorith';
        this.fullName = 'Anorith SS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                // eslint-disable-next-line no-empty
                if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== '' && card.stage !== card_types_1.Stage.LV_X) {
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, {}, { min: 1, max: 1, blocked });
        }
        return state;
    }
}
exports.Anorith = Anorith;
