"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lombre = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Lombre extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lotad';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Aqua Lift',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Lombre has any Water Energy attached to it, the Retreat Cost for Lombre is 0.'
            }];
        this.attacks = [
            {
                name: 'Ambush',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
            }
        ];
        this.set = 'DX';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lombre';
        this.fullName = 'Lombre DX';
    }
    reduceEffect(store, state, effect) {
        // Handle Aqua Lift Poké-Body
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEBODY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Check if there is any Water energy attached
            const hasWaterEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(game_1.CardType.WATER) || energy.provides.includes(game_1.CardType.ANY));
            if (hasWaterEnergy) {
                effect.cost = [];
            }
        }
        // Handle Ambush attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Flip a coin
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                if (result) {
                    effect.damage += 20; // 20 base + 20 for heads
                }
                return state;
            });
        }
        return state;
    }
}
exports.Lombre = Lombre;
