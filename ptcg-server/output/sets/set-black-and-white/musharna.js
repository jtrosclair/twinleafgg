"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Musharna = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Musharna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Munna';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dream Eater',
                cost: [P],
                damage: 90,
                text: 'If the Defending Pokémon is not Asleep, this attack does nothing.'
            },
            {
                name: 'Psybeam',
                cost: [P, P, C],
                damage: 40,
                text: 'The Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Musharna';
        this.fullName = 'Musharna BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (!opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                effect.damage = 0;
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Musharna = Musharna;
