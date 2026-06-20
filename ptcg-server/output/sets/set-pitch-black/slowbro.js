"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowbro extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'All Out',
                cost: [P],
                damage: 50,
                damageCalculation: '+',
                text: 'If you have no cards in your hand, this attack does 160 more damage.',
            },
            {
                name: 'Zen Headbutt',
                cost: [C, C, C],
                damage: 110,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '29';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                effect.damage += 160;
            }
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
