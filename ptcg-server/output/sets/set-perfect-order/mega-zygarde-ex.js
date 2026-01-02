"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaZygardeex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaZygardeex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 310;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gaia Wave',
                cost: [F, F, F],
                damage: 200,
                text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks.',
            },
            {
                name: 'Munikis Zero',
                cost: [F, F, F, F, F],
                damage: 0,
                text: 'For each of your opponent\'s Pokémon, flip a coin. If heads, this attack does 150 damage to that Pokemon.',
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Zygarde ex';
        this.fullName = 'Mega Zygarde ex M3';
    }
    reduceEffect(store, state, effect) {
        // Gaia Wave
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.active.damageReductionNextTurn = 30;
        }
        // Munikis Zero
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Collect all opponent Pokemon (active + bench)
            const allOpponentPokemon = [opponent.active, ...opponent.bench.filter(b => b.cards.length > 0)];
            // Flip coins sequentially for each Pokemon
            let currentIndex = 0;
            const flipCoinForPokemon = (s) => {
                if (currentIndex >= allOpponentPokemon.length) {
                    return s;
                }
                const target = allOpponentPokemon[currentIndex];
                const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                    if (result) {
                        // Heads - apply 150 damage to this Pokemon
                        let damageEffect;
                        // Use DealDamageEffect for active Pokemon (applies Weakness/Resistance)
                        // Use PutDamageEffect for benched Pokemon (doesn't apply Weakness/Resistance)
                        if (target === opponent.active) {
                            damageEffect = new attack_effects_1.DealDamageEffect(effect, 150);
                        }
                        else {
                            damageEffect = new attack_effects_1.PutDamageEffect(effect, 150);
                        }
                        damageEffect.target = target;
                        store.reduceEffect(s, damageEffect);
                    }
                    // Move to next Pokemon
                    currentIndex++;
                    flipCoinForPokemon(s);
                });
                return store.reduceEffect(s, coinFlipEffect);
            };
            return flipCoinForPokemon(state);
        }
        return state;
    }
}
exports.MegaZygardeex = MegaZygardeex;
