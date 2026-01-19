"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsNidoranFemale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsNidoranFemale extends pokemon_card_1.PokemonCard {
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
                name: 'Suprise Attack',
                cost: [D],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '114';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Nidoran F';
        this.fullName = 'Team Rocket\'s Nidoran F DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => { if (!result) {
                effect.damage = 0;
            } });
        }
        return state;
    }
}
exports.TeamRocketsNidoranFemale = TeamRocketsNidoranFemale;
