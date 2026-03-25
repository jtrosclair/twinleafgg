"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leavanny = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Leavanny extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Swadloon';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Leaf Tailor',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Each of your Pokémon that has any Energy attached to it has no Weakness.'
            }];
        this.attacks = [{
                name: 'Cutting Arm',
                cost: [G, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
            }];
        this.set = 'NVI';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Leavanny';
        this.fullName = 'Leavanny NVI';
    }
    reduceEffect(store, state, effect) {
        // Leaf Tailor - remove weakness from Pokémon with energy attached
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            // Find who owns this Leavanny and if it's in play
            let leavannyOwner = null;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.getPokemonCard() === this) {
                        leavannyOwner = p;
                    }
                });
            });
            if (!leavannyOwner) {
                return state;
            }
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, leavannyOwner, this)) {
                return state;
            }
            // Check if target is owned by same player
            let targetOwner = null;
            state.players.forEach(p => {
                if (p.active === effect.target || p.bench.includes(effect.target)) {
                    targetOwner = p;
                }
            });
            if (targetOwner !== leavannyOwner) {
                return state;
            }
            // Check if target has energy attached
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(targetOwner, effect.target);
            store.reduceEffect(state, checkEnergy);
            if (checkEnergy.energyMap.length > 0) {
                // Remove weakness
                effect.weakness = [];
            }
        }
        // Cutting Arm - flip 2 coins, +20 per heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Leavanny = Leavanny;
