"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whirlipede = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Whirlipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Venipede';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Venoshock',
                cost: [P],
                damage: 10,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Poisoned, this attack does 60 more damage.'
            },
            {
                name: 'Steamroller',
                cost: [C, C, C],
                damage: 40,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Whirlipede';
        this.fullName = 'Whirlipede EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const isPoisoned = opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED);
            if (isPoisoned) {
                effect.damage += 60;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Whirlipede = Whirlipede;
