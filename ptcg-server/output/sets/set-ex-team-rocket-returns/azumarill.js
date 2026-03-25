"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azumarill = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Azumarill extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Marill';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Froth',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Azumarill from your hand to evolve 1 of your Active Pokémon, you may use this power. Each Defending Pokémon is now Paralyzed.'
            }];
        this.attacks = [{
                name: 'Water Punch',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin for each [W] Energy attached to Azumarill. This attack does 20 damage plus 20 more damage for each heads.'
            }];
        this.set = 'TRR';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Azumarill';
        this.fullName = 'Azumarill TRR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this) && effect.target === effect.player.active) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                    const canApplyAbility = new game_effects_1.EffectOfAbilityEffect(effect.player, this.powers[0], this, opponent.active);
                    store.reduceEffect(state, canApplyAbility);
                    if (canApplyAbility.target) {
                        (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Count Water energy
            let waterEnergyCount = 0;
            checkProvidedEnergy.energyMap.forEach(energy => {
                if (energy.provides.includes(game_1.CardType.WATER) || energy.provides.includes(game_1.CardType.ANY)) {
                    waterEnergyCount++;
                }
            });
            // Flip coins equal to Water energy count
            let heads = 0;
            for (let i = 0; i < waterEnergyCount; i++) {
                state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                    if (result) {
                        heads++;
                    }
                    if (i === waterEnergyCount - 1) {
                        effect.damage = 20 + (20 * heads);
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.Azumarill = Azumarill;
