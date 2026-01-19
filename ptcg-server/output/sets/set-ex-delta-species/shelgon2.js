"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelgon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Shelgon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bagon';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Shelgon by attacks is reduced by 10 (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Heat Blast',
                cost: [R, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'DS';
        this.name = 'Shelgon';
        this.fullName = 'Shelgon DS 54';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.getPokemonCard() === this) {
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            effect.damage -= 10;
        }
        return state;
    }
}
exports.Shelgon2 = Shelgon2;
