"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkTyranitar2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DarkTyranitar2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dark Pupitar';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Grind',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each Energy attached to Dark Tyranitar.'
            },
            {
                name: 'Spinning Tail',
                cost: [D, C, C],
                damage: 0,
                text: 'Does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Bite Off',
                cost: [D, D, C, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Pokémon-ex, this attack does 70 damage plus 50 more damage.'
            }
        ];
        this.set = 'TRR';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Tyranitar';
        this.fullName = 'Dark Tyranitar TRR 19';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Grind
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            const damagePerEnergy = 10;
            let energyCount = 0;
            checkProvidedEnergy.energyMap.forEach(em => {
                energyCount += em.provides.length;
            });
            effect.damage += energyCount * damagePerEnergy;
        }
        // Spinning Tail
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 20);
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        // Bite Off
        if (prefabs_1.WAS_ATTACK_USED(effect, 2, this)) {
            const defending = effect.opponent.active;
            if (defending && ((_a = defending.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.DarkTyranitar2 = DarkTyranitar2;
