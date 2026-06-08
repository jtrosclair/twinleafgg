"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deoxys2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Deoxys2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Psy Spear',
                cost: [P, P, P],
                damage: 120,
                text: 'If this Pokemon has at least 2 extra Energy attached to it, this attack also does 120 damage to 1 of your opponent\'s Benched Pokemon.'
            }
        ];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.usSetNumber = 'CRI 32';
        this.name = 'Deoxys';
        this.fullName = 'Deoxys M4 32';
    }
    reduceEffect(store, state, effect) {
        // Attack: Psy Spear
        // Ref: set-fusion-strike/heatmor.ts (extra energy + bench damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
                state = store.reduceEffect(state, checkCost);
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
                store.reduceEffect(state, checkEnergy);
                const totalEnergy = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
                const extraEnergy = totalEnergy - 3; // [P][P][P] cost
                if (extraEnergy >= 2) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 120);
                            damageEffect.target = target;
                            store.reduceEffect(state, damageEffect);
                        });
                        return state;
                    });
                }
            }
        }
        return state;
    }
}
exports.Deoxys2 = Deoxys2;
