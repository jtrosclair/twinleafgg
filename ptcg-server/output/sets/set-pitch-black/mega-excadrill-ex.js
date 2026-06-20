"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaExcadrillex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaExcadrillex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 340;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Dig And Break',
                cost: [M, M],
                damage: 90,
                text: 'Discard the top 2 cards from your opponent\'s deck.',
            },
            {
                name: 'Maximum Drill',
                cost: [M, M, M],
                damage: 200,
                damageCalculation: '+',
                text: 'If this Pokémon has at least 2 extra Energy attached to it (in addition to this attack\'s cost), this attack does 130 more damage.',
            }];
        this.set = 'M5';
        this.setNumber = '63';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Excadrill ex';
        this.fullName = 'Mega Excadrill ex M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-fusion-strike/pangoro.ts (discard top of opponent\'s deck)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, opponent, 2, this, effect);
        }
        // Ref: set-black-bolt-white-flare/jellicent-ex.ts (extra Energy bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[1]);
            state = store.reduceEffect(state, checkCost);
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const totalEnergy = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
            const extraEnergy = totalEnergy - checkCost.cost.length;
            if (extraEnergy >= 2) {
                effect.damage += 130;
            }
        }
        return state;
    }
}
exports.MegaExcadrillex = MegaExcadrillex;
