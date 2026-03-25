"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scolipede = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scolipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Whirlipede';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Megahorn',
                cost: [P, C, C],
                damage: 70,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
            {
                name: 'Venoshock',
                cost: [P, P, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Poisoned, this attack does 60 more damage.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.name = 'Scolipede';
        this.fullName = 'Scolipede BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Scolipede = Scolipede;
