"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D, value: +20 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Hypnosis',
                cost: [],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Dream Eater',
                cost: [P, P],
                damage: 60,
                text: 'If the Defending Pokémon is not Asleep, this attack does nothing.'
            }];
        this.set = 'DP';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Haunter';
        this.fullName = 'Haunter DP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (!effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                effect.damage = 0;
                return state;
            }
        }
        return state;
    }
}
exports.Haunter = Haunter;
