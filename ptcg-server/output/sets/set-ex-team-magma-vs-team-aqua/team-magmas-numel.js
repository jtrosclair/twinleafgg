"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasNumel = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasNumel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Combustion',
                cost: [R, C],
                damage: 10,
                text: ''
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Team Magma\'s Numel';
        this.fullName = 'Team Magma\'s Numel MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.TeamMagmasNumel = TeamMagmasNumel;
