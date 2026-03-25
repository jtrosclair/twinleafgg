"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaMawileEx = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaMawileEx extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 270;
        this.cardType = M;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gobble Down',
                cost: [M, M],
                damage: 80,
                damageCalculation: 'x',
                text: 'This attack does 80 damage for each Prize card you have taken.'
            },
            {
                name: 'Huge Bite',
                cost: [M, M, C],
                damage: 260,
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack\'s base damage is 30.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Mega Mawile ex';
        this.fullName = 'Mega Mawile ex M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const prizesTaken = 6 - player.getPrizeLeft();
            const damagePerPrize = 80;
            effect.damage = (prizesTaken * damagePerPrize);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.damage > 0) {
                effect.damage = 30;
            }
        }
        return state;
    }
}
exports.MegaMawileEx = MegaMawileEx;
