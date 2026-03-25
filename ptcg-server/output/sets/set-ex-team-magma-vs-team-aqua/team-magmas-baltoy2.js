"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasBaltoy2 = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasBaltoy2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Night Attack',
                cost: [F],
                damage: 0,
                text: 'Put 1 damage counter on 1 of your opponent\'s Pokémon.'
            },
            {
                name: 'Spinning Attack',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Team Magma\'s Baltoy';
        this.fullName = 'Team Magma\'s Baltoy MA 61';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(1, store, state, effect);
        }
        return state;
    }
}
exports.TeamMagmasBaltoy2 = TeamMagmasBaltoy2;
