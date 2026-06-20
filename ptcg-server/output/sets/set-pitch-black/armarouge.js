"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armarouge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Armarouge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Flame Legion',
                cost: [R],
                damage: 40,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each Benched Pokémon that has an [R] Energy attached.',
            }];
        this.set = 'M5';
        this.setNumber = '11';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Armarouge';
        this.fullName = 'Armarouge M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-chaos-rising/mega-pyroar-ex.ts (+40 benches with energy type via CheckProvidedEnergyEffect)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let benchesWithFire = 0;
            effect.player.bench.forEach(slot => {
                if (slot.cards.length === 0) {
                    return;
                }
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player, slot);
                store.reduceEffect(state, checkEnergy);
                const hasFireEnergy = checkEnergy.energyMap.some(em => em.provides.some(t => t === card_types_1.CardType.FIRE || t === card_types_1.CardType.ANY || t === card_types_1.CardType.WLFM || t === card_types_1.CardType.GRW));
                if (hasFireEnergy) {
                    benchesWithFire += 1;
                }
            });
            effect.damage += 40 * benchesWithFire;
        }
        return state;
    }
}
exports.Armarouge = Armarouge;
