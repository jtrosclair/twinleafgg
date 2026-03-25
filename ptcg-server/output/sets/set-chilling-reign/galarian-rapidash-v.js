"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianRapidashV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianRapidashV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 210;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Libra Horn',
                cost: [C, C],
                damage: 0,
                text: 'Put damage counters on 1 of your opponent\'s Pokémon until its remaining HP is 100.'
            },
            {
                name: 'Psychic',
                cost: [P, P],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '167';
        this.name = 'Galarian Rapidash V';
        this.fullName = 'Galarian Rapidash V CRE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const selectedTarget = targets[0];
                const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
                store.reduceEffect(state, checkHpEffect);
                const totalHp = checkHpEffect.hp;
                let damageAmount = totalHp - 100;
                // Adjust damage if the target already has damage
                const targetDamage = selectedTarget.damage;
                if (targetDamage > 0) {
                    damageAmount = Math.max(0, damageAmount - targetDamage);
                }
                if (damageAmount > 0) {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                    damageEffect.target = selectedTarget;
                    store.reduceEffect(state, damageEffect);
                }
                else if (damageAmount <= 0) {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 0);
                    damageEffect.target = selectedTarget;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 30;
        }
        return state;
    }
}
exports.GalarianRapidashV = GalarianRapidashV;
