"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaPyroarex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaPyroarex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litleo';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 340;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Ferocious Bellow',
                cost: [R, C],
                damage: 80,
                text: 'During your opponent\'s next turn, the Defending Pokemon\'s attacks do 50 less damage.'
            },
            {
                name: 'Big Bang Fire',
                cost: [R, R, C],
                damage: 290,
                damageCalculation: '-',
                text: 'This attack does 10 less damage for each damage counter on this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Mega Pyroar ex';
        this.fullName = 'Mega Pyroar ex M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.active.damageReductionNextTurn = 50;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const damageCounters = Math.floor(player.active.damage / 10);
            effect.damage = Math.max(0, 290 - damageCounters * 10);
        }
        return state;
    }
}
exports.MegaPyroarex = MegaPyroarex;
