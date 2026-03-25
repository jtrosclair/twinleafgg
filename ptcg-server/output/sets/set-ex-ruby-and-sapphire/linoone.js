"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linoone = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Linoone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zigzagoon';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Seek Out',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Continuous Headbutt',
                cost: [C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 40 damage times the number of heads.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Linoone';
        this.fullName = 'Linoone RS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 0, max: 2 }, this.attacks[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, heads => {
                effect.damage = heads * 40;
            });
        }
        return state;
    }
}
exports.Linoone = Linoone;
