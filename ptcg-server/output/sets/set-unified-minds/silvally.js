"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silvally = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Silvally extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Type: Null';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Avenging Heart',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Prize card your opponent took on their last turn.'
            },
            {
                name: 'Air Slash',
                cost: [C, C, C],
                damage: 120,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '184';
        this.name = 'Silvally';
        this.fullName = 'Silvally UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = opponent.prizesTakenLastTurn;
            effect.damage += prizesTaken * 50;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Silvally = Silvally;
