"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChiYu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ChiYu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spiraling Envy',
                cost: [D],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon has 2 or more damage counters on it, this attack does 90 more damage. Don\'t apply Weakness for this attack\'s damage.',
            }];
        this.set = 'M5';
        this.setNumber = '57';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chi-Yu';
        this.fullName = 'Chi-Yu M5';
    }
    reduceEffect(store, state, effect) {
        // Spiraling Envy
        // Ref: set-unified-minds/honedge-2.ts (ignoreWeakness), set-destined-rivals/cynthias-spiritomb.ts (bonus + ignoreWeakness)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreWeakness = true;
            if (effect.player.active.damage >= 20) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.ChiYu = ChiYu;
