"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsNidorino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsNidorino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Nidoran M';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Hammer In',
                cost: [D, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Horned Gouge',
                cost: [D, D, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 60 more damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '118';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Nidorino';
        this.fullName = 'Team Rocket\'s Nidorino DRI';
    }
    reduceEffect(store, state, effect) {
        // Horned Gouge
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (effect.opponent.active.damage > 0) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.TeamRocketsNidorino = TeamRocketsNidorino;
