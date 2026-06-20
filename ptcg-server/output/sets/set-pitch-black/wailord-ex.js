"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailordex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wailordex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wailmer';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 380;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Surf',
                cost: [W, W, W],
                damage: 120,
                text: '',
            },
            {
                name: 'Falling Down',
                cost: [W, W, W, W, W],
                damage: 270,
                text: 'This Pokémon is now Asleep.',
            }];
        this.set = 'M5';
        this.setNumber = '15';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wailord ex';
        this.fullName = 'Wailord ex M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-ultra-prism/roserade.ts (Inviting Poison — AfterAttack + direct special condition)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            effect.player.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        }
        return state;
    }
}
exports.Wailordex = Wailordex;
