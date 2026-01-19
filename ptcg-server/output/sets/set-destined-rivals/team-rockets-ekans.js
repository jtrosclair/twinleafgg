"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsEkans = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsEkans extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Hold Back',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Gnaw',
                cost: [D],
                damage: 10,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '112';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Ekans';
        this.fullName = 'Team Rocket\'s Ekans DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => { if (result) {
                (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
            } });
        }
        return state;
    }
}
exports.TeamRocketsEkans = TeamRocketsEkans;
