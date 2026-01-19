"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salazzle = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Salazzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Salandit';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nasty Plot',
                cost: [P],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Severe Poison',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon between turns.'
            }];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Salazzle';
        this.fullName = 'Salazzle CIN';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 0, max: 2 }, this.attacks[0]);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this, 40);
        }
        return state;
    }
}
exports.Salazzle = Salazzle;
