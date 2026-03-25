"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bisharp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slash',
                cost: [C],
                damage: 40,
                text: ''
            },
            {
                name: 'Dragon Slayer',
                cost: [D, D, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Dragon Pokémon, this attack does 40 more damage.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const defending = opponent.active.getPokemonCard();
            if (defending && defending.cardType === card_types_1.CardType.DRAGON) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Bisharp = Bisharp;
