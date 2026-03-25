"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zoroark extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mind Jack',
                cost: [D],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Foul Play',
                cost: [C, C, C],
                damage: 0,
                copycatAttack: true,
                text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark SV11W';
    }
    reduceEffect(store, state, effect) {
        // Mind Jack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            let benched = 0;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== opponent.active) {
                    benched++;
                }
            });
            effect.damage = benched * 30;
        }
        // Foul Play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.COPY_OPPONENT_ACTIVE_ATTACK)(store, state, effect);
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
