"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Stardust Song',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Jirachi from your hand onto your Bench, you may flip 3 coins. For each heads, search your discard pile for a [P] Energy card and attach it to Jirachi.'
            }];
        this.attacks = [{
                name: 'Time Hollow',
                cost: [P],
                damage: 0,
                text: 'Choose a number of your opponent\'s Stage 1 or Stage 2 Evolved Pokémon up to the amount of Energy attached to Jirachi. Remove the highest Stage Evolution card from each of those Pokémon and put those cards back into your opponent\'s hand.'
            }];
        this.set = 'CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi CL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (!player.discard.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.PSYCHIC))) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, wantToUse => {
                if (wantToUse) {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                    const blocked = [];
                    player.discard.cards.forEach((c, index) => {
                        if (!(c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.PSYCHIC))) {
                            blocked.push(index);
                        }
                    });
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    let heads = 0;
                    (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                        results.forEach(r => {
                            if (r)
                                heads++;
                        });
                        const energyCount = Math.min(heads, player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.PSYCHIC)).length);
                        const blockedTo = [];
                        player.bench.forEach((list, index) => {
                            if (index !== effect.index) {
                                blockedTo.push({
                                    player: game_1.PlayerType.BOTTOM_PLAYER,
                                    slot: game_1.SlotType.BENCH,
                                    index
                                });
                            }
                        });
                        if (energyCount > 0) {
                            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: false, min: energyCount, max: energyCount, blockedTo }), transfers => {
                                transfers = transfers || [];
                                // cancelled by user
                                if (transfers.length === 0) {
                                    return;
                                }
                                for (const transfer of transfers) {
                                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                    player.discard.moveCardTo(transfer.card, target);
                                }
                            });
                        }
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let canDevolve = false;
            const blocked = [];
            effect.opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                var _a, _b;
                if (list.getPokemons().length > 1 && (((_a = list.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_1 || ((_b = list.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) === card_types_1.Stage.STAGE_2)) {
                    canDevolve = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!canDevolve) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 0, max: checkProvidedEnergy.energyMap.length, blocked }), (results) => {
                if (results && results.length > 0) {
                    for (const targetPokemon of results) {
                        const pokemons = targetPokemon.getPokemons();
                        if (pokemons.length > 1) {
                            const highestStagePokemon = pokemons[pokemons.length - 1];
                            targetPokemon.moveCardsTo([highestStagePokemon], effect.opponent.hand);
                            targetPokemon.clearEffects();
                            targetPokemon.pokemonPlayedTurn = state.turn;
                        }
                    }
                }
                return state;
            });
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
