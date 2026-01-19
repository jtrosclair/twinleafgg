"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsHypno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsHypno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Drowzee';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [P],
                damage: 40,
                text: ''
            },
            {
                name: 'Bench Manipulation',
                cost: [P, P, P],
                damage: 80,
                damageCalculation: 'x',
                text: 'Your opponent flips a coin for each of their Benched Pokemon. This attack does 80 damage for each tails. Don\'t apply Weakness and Resistance for this attack\'s damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Hypno';
        this.fullName = 'Team Rocket\'s Hypno DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            let tails = 0;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (opponent.active === card) {
                    return;
                }
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                    if (!result) {
                        tails++;
                    }
                });
            });
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
            effect.damage = (80 * tails);
        }
        return state;
    }
}
exports.TeamRocketsHypno = TeamRocketsHypno;
