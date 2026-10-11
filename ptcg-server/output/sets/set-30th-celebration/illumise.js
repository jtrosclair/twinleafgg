"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Illumise = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Illumise extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = game_1.CardType.GRASS;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Supereffective Pheromones',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have Volbeat in play, apply Weakness for both Active Pokémon as x3.'
            }];
        this.attacks = [{
                name: 'Ram',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Illumise';
        this.fullName = 'Illumise 30C';
    }
    reduceEffect(store, state, effect) {
        // Supereffective Pheromones
        if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
            // Only one Illumise applies (no stacking); first qualifying in play order wins
            let applicator;
            for (const player of state.players) {
                let hasVolbeat = false;
                const illumises = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (cardList.getPokemonCard() !== card) {
                        return;
                    }
                    if (card.name === 'Volbeat') {
                        hasVolbeat = true;
                    }
                    if (card.name === 'Illumise' && card.powers.some(p => p.name === 'Supereffective Pheromones')) {
                        illumises.push(card);
                    }
                });
                if (!hasVolbeat) {
                    continue;
                }
                for (const illumise of illumises) {
                    if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, illumise)) {
                        applicator = illumise;
                        break;
                    }
                }
                if (applicator) {
                    break;
                }
            }
            if (applicator !== this) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            const checkPokemonStats = new check_effects_1.CheckPokemonStatsEffect(effect.target);
            store.reduceEffect(state, checkPokemonStats);
            const hasWeakness = !effect.ignoreWeakness && checkPokemonStats.weakness.some(w => w.value === undefined && checkPokemonType.cardTypes.includes(w.type));
            if (hasWeakness) {
                // ×2 from engine × 1.5 here = ×3
                effect.damage = effect.damage * 1.5;
            }
        }
        return state;
    }
}
exports.Illumise = Illumise;
