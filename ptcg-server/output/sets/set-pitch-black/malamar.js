"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Malamar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Malamar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Inkay';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Perplex',
                cost: [D],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.',
            },
            {
                name: 'Brain Crush',
                cost: [D, D],
                damage: 130,
                text: 'If your opponent\'s Active Pokémon isn\'t Confused, this attack does nothing.',
            }];
        this.set = 'M5';
        this.setNumber = '50';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Malamar';
        this.fullName = 'Malamar M5';
    }
    reduceEffect(store, state, effect) {
        // Perplex
        // Ref: set-lost-origin/magearna.ts (Windup Beam - YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
        }
        // Brain Crush
        // Ref: set-dragons-majesty/heatmor.ts (Charring Breath)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (!effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED)) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Malamar = Malamar;
