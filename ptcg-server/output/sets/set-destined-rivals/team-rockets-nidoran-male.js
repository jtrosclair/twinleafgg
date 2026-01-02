"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsNidoranMale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class TeamRocketsNidoranMale extends pokemon_card_1.PokemonCard {
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
                name: 'Pierce',
                cost: [D],
                damage: 10,
                text: ''
            },
            {
                name: 'Hammer In',
                cost: [D, D],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '117';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Nidoran M';
        this.fullName = 'Team Rocket\'s Nidoran M DRI';
    }
}
exports.TeamRocketsNidoranMale = TeamRocketsNidoranMale;
