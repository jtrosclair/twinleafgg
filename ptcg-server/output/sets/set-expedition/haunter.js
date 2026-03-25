"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nightmare',
                cost: [P, C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Dream Eater',
                cost: [P, C],
                damage: 50,
                text: 'If the Defending Pokémon isn\'t Asleep, this attack does nothing.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Haunter';
        this.fullName = 'Haunter EX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (!effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Haunter = Haunter;
