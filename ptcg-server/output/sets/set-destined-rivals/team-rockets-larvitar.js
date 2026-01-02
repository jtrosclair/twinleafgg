"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsLarvitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsLarvitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mountain Munch',
                cost: [C],
                damage: 10,
                text: 'Discard the top card of your opponent\'s deck.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '94';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Larvitar';
        this.fullName = 'Team Rocket\'s Larvitar DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.MOVE_CARDS(store, state, game_1.StateUtils.getOpponent(state, effect.player).deck, game_1.StateUtils.getOpponent(state, effect.player).discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
        }
        return state;
    }
}
exports.TeamRocketsLarvitar = TeamRocketsLarvitar;
