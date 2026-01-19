"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsZubat = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsZubat extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Poison Spray',
                cost: [D],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '120';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Zubat';
        this.fullName = 'Team Rocket\'s Zubat DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.TeamRocketsZubat = TeamRocketsZubat;
