"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swampertex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Swampertex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Marshtomp';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Hyper Pump',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 20 more damage for each basic Energy attached to Swampert ex but not used to pay for this attack\'s Energy cost. You can\'t add more than 80 damage in this way.'
            },
            {
                name: 'Crushing Wave',
                cost: [W, C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. After doing damage, flip a coin. If heads, your opponent discards an Energy card, if any, attached to that Pokémon. (Don\'t apply Weakness and Resistance to Benched Pokémon.)'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Swampert ex';
        this.fullName = 'Swampert ex MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Hyper Pump counts basic Energy not used to pay this attack's [C] cost.
            const basicEnergyProvided = checkEnergy.energyMap
                .filter(e => e.card.superType === card_types_1.SuperType.ENERGY && e.card.energyType === card_types_1.EnergyType.BASIC)
                .reduce((total, energy) => total + energy.provides.length, 0);
            const nonBasicEnergyProvided = checkEnergy.energyMap
                .filter(e => e.card.superType !== card_types_1.SuperType.ENERGY || e.card.energyType !== card_types_1.EnergyType.BASIC)
                .reduce((total, energy) => total + energy.provides.length, 0);
            const basicEnergyNeededForCost = Math.max(0, checkCost.cost.length - nonBasicEnergyProvided);
            const extraBasicEnergy = Math.max(0, basicEnergyProvided - basicEnergyNeededForCost);
            effect.damage += Math.min(extraBasicEnergy, 4) * 20;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            this.crushingWaveTarget = undefined;
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const targets = selected || [];
                if (targets.length === 0) {
                    return;
                }
                const target = targets[0];
                this.crushingWaveTarget = target;
                effect.target = target;
                let damageEffect;
                if (target === opponent.active) {
                    damageEffect = new attack_effects_1.DealDamageEffect(effect, 40);
                }
                else {
                    damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                }
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const target = this.crushingWaveTarget;
            if (target === undefined) {
                return state;
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const energyCards = target.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    if (energyCards.length === 0) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, target, opponent.discard, { cards: cards });
                        }
                    });
                }
            });
            this.crushingWaveTarget = undefined;
        }
        return state;
    }
}
exports.Swampertex = Swampertex;
