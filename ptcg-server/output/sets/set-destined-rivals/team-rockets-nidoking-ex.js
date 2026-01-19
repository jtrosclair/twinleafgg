"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsNidokingex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsNidokingex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Team Rocket\'s Nidorino';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET, card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 330;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dirty Horns',
                cost: [D, D, C],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 8 damage counters on that Pokémon instead of 1.'
            },
            {
                name: 'King\'s Impact',
                cost: [D, D, D, C],
                damage: 240,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '119';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Nidoking ex';
        this.fullName = 'Team Rocket\'s Nidoking ex DRI';
    }
    reduceEffect(store, state, effect) {
        // Dirty Horns
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this, 80);
        }
        return state;
    }
}
exports.TeamRocketsNidokingex = TeamRocketsNidokingex;
