"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaZeraoraex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaZeraoraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 270;
        this.cardType = L;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Thunder Fist',
                cost: [L],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 60 damage times the number of [L] Energy attached to this Pokémon.',
            },
            {
                name: 'Zepto Turn',
                cost: [L, L, L],
                damage: 150,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '26';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Zeraora ex';
        this.fullName = 'Mega Zeraora ex M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const check = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, check);
            let n = 0;
            check.energyMap.forEach(em => {
                n += em.provides.filter(t => t === card_types_1.CardType.LIGHTNING || t === card_types_1.CardType.ANY || t === card_types_1.CardType.WLFM).length;
            });
            effect.damage += 60 * n;
        }
        // Ref: prefabs SWITCH after damage (AGENTS — AfterAttackEffect)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        return state;
    }
}
exports.MegaZeraoraex = MegaZeraoraex;
