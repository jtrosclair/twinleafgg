"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsDrowzee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsDrowzee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Hypnotic Ray',
                cost: [P],
                damage: 10,
                text: 'Your opponent\'s Active Pokemon is now Asleep.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Drowzee';
        this.fullName = 'Team Rocket\'s Drowzee DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.TeamRocketsDrowzee = TeamRocketsDrowzee;
