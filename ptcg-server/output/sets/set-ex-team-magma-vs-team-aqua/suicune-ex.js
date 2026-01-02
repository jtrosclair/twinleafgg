"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suicuneex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Suicuneex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Energy Flip',
                cost: [W],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Benched Pokémon. This attack does 10 damage to that Pokémon. You may move an Energy card attached to that Pokémon to another of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Reverse Stream',
                cost: [W, W, C],
                damage: 50,
                damageCalculation: '+',
                text: 'You may return all basic Energy cards attached to Suicune ex to your hand. If you do, this attack does 50 damage plus 10 more damage for each basic Energy card you returned.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Suicune ex';
        this.fullName = 'Suicune ex MA';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (opponentBench === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected;
                const blockedFrom = [];
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    if (cardList !== targets[0]) {
                        blockedFrom.push(target);
                    }
                });
                targets.forEach(target => {
                    //damage
                    const damageEffect = new attack_effects_1.DealDamageEffect(effect, 10);
                    damageEffect.target = target;
                    if (target !== opponent.active) {
                        effect.ignoreWeakness = true;
                        effect.ignoreResistance = true;
                    }
                    store.reduceEffect(state, damageEffect);
                    // Move energy
                    const blockedMap = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                        store.reduceEffect(state, checkProvidedEnergy);
                        const blockedCards = [];
                        checkProvidedEnergy.energyMap.forEach(em => {
                            if (em.provides.length === 0) {
                                blockedCards.push(em.card);
                            }
                        });
                        cardList.cards.forEach(em => {
                            if (cardList.getPokemons().includes(em)) {
                                blockedCards.push(em);
                            }
                        });
                        const blocked = [];
                        blockedCards.forEach(bc => {
                            const index = cardList.cards.indexOf(bc);
                            if (index !== -1 && !blocked.includes(index)) {
                                blocked.push(index);
                            }
                        });
                        if (blocked.length !== 0) {
                            blockedMap.push({ source: target, blocked });
                        }
                    });
                    store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], {}, { min: 0, max: 1, allowCancel: false, blockedMap, blockedFrom }), transfers => {
                        if (transfers === null) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            if (transfer.card instanceof pokemon_card_1.PokemonCard) {
                                // If card is in source energies, move it from there; otherwise move from main cards array
                                if (source.energies.cards.includes(transfer.card)) {
                                    source.energies.moveCardTo(transfer.card, target.energies);
                                    // Also ensure it's in target's main cards array
                                    if (!target.cards.includes(transfer.card)) {
                                        target.cards.push(transfer.card);
                                    }
                                }
                                else {
                                    source.moveCardTo(transfer.card, target);
                                    if (!target.energies.cards.includes(transfer.card)) {
                                        target.energies.cards.push(transfer.card);
                                    }
                                }
                            }
                            else {
                                source.moveCardTo(transfer.card, target);
                            }
                        }
                    });
                });
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    // Damage for each basic energy card
                    player.active.cards.forEach(c => {
                        if (c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC) {
                            effect.damage += 10;
                        }
                    });
                    // Move all basic energy cards to hand
                    player.active.cards.forEach(c => {
                        if (c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC) {
                            prefabs_1.MOVE_CARD_TO(state, c, player.hand);
                        }
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        return state;
    }
}
exports.Suicuneex = Suicuneex;
