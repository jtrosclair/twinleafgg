"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lycanroc = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lycanroc extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rockruff';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Dangerous Rogue',
                cost: [F, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Accelerock',
                cost: [F, F, C],
                damage: 100,
                text: ''
            }];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Lycanroc';
        this.fullName = 'Lycanroc FLI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += (opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 20);
        }
        return state;
    }
}
exports.Lycanroc = Lycanroc;
