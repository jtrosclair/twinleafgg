"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Pichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BABY];
        this.cardType = L;
        this.hp = 30;
        this.retreat = [];
        this.evolvesTo = ['Pikachu'];
        this.powers = [{
                name: 'Baby Rule',
                powerType: game_1.PowerType.BABY_RULE,
                text: 'If this Baby Pokémon is your Active Pokémon and your opponent tries to attack, your opponent flips a coin (before doing anything required in order to use that attack). If tails, your opponent\'s turn ends without an attack.'
            }];
        this.attacks = [{
                name: 'Zzzap',
                cost: [C],
                damage: 0,
                text: 'Does 20 damage to each Pokémon in play that has a Pokémon Power. Don\'t apply Weakness and Resistance.'
            }];
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Pichu';
        this.fullName = 'Pichu N1';
        this.BABY_MARKER = 'BABY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Baby Rule effect
        if (effect instanceof game_effects_1.UseAttackEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.BABY_RULE,
                    text: ''
                }, this));
            }
            catch (_a) {
                return state;
            }
            // avoids recursion
            if (prefabs_1.HAS_MARKER(this.BABY_MARKER, effect.player)) {
                return state;
            }
            prefabs_1.ADD_MARKER(this.BABY_MARKER, effect.player, this);
            if (opponent.active.getPokemonCard() === this) {
                effect.preventDefault = true;
                prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                    if (!result) {
                        const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                        store.reduceEffect(state, endTurnEffect);
                    }
                    else {
                        const useAttackEffect = new game_effects_1.UseAttackEffect(player, effect.attack);
                        store.reduceEffect(state, useAttackEffect);
                    }
                });
            }
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.BABY_MARKER, this);
        // Zzzap attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check both players' Pokémon for Poké-Powers/Bodies
            [player, opponent].forEach(currentPlayer => {
                // Check active Pokémon
                const activeCard = currentPlayer.active.getPokemonCard();
                if (activeCard) {
                    const stubPowerEffect = new game_effects_1.PowerEffect(currentPlayer, {
                        name: 'test',
                        powerType: game_1.PowerType.POKEMON_POWER,
                        text: ''
                    }, activeCard);
                    try {
                        store.reduceEffect(state, stubPowerEffect);
                        if (activeCard.powers.length) {
                            // Apply 20 damage without Weakness/Resistance
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                            damageEffect.target = currentPlayer.active;
                            store.reduceEffect(state, damageEffect);
                        }
                    }
                    catch (_a) {
                        return state;
                    }
                }
                // Check bench Pokémon
                currentPlayer.bench.forEach(bench => {
                    const benchCard = bench.getPokemonCard();
                    if (benchCard) {
                        const stubPowerEffect = new game_effects_1.PowerEffect(currentPlayer, {
                            name: 'test',
                            powerType: game_1.PowerType.POKEMON_POWER,
                            text: ''
                        }, benchCard);
                        try {
                            store.reduceEffect(state, stubPowerEffect);
                            if (benchCard.powers.length) {
                                // Apply 20 damage without Weakness/Resistance
                                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                                damageEffect.target = bench;
                                store.reduceEffect(state, damageEffect);
                            }
                        }
                        catch (_a) {
                            return state;
                        }
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.Pichu = Pichu;
