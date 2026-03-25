"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronLeavesex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IronLeavesex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.cardType = G;
        this.hp = 220;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Rapid Vernier',
                powerType: game_1.PowerType.ABILITY,
                exemptFromInitialize: true,
                text: 'Once during your turn, when you play this Pokémon from your hand onto your Bench, you may switch this Pokémon with your Active Pokémon. If you do, you may move any number of Energy from your Benched Pokémon to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Prism Edge',
                cost: [G, G, C],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t attack.',
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Iron Leaves ex';
        this.fullName = 'Iron Leaves ex TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard == this) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    // Try to reduce PowerEffect, to check if something is blocking our ability
                    try {
                        const stub = new game_effects_1.PowerEffect(player, {
                            name: 'test',
                            powerType: game_1.PowerType.ABILITY,
                            text: ''
                        }, this);
                        store.reduceEffect(state, stub);
                    }
                    catch (_a) {
                        return state;
                    }
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    const benchIndex = player.bench.indexOf(cardList);
                    player.switchPokemon(player.bench[benchIndex], store, state);
                    const blockedFrom = [];
                    const blockedTo = [];
                    let hasEnergyOnBench = false;
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (cardList === player.active) {
                            blockedFrom.push(target);
                            return;
                        }
                        blockedTo.push(target);
                        if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                            hasEnergyOnBench = true;
                        }
                    });
                    if (hasEnergyOnBench === false) {
                        return state;
                    }
                    return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
                    { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, blockedFrom, blockedTo }), transfers => {
                        if (!transfers) {
                            return;
                        }
                        for (const transfer of transfers) {
                            // Can only move energy to the active Pokemon
                            const target = player.active;
                            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                            transfers.forEach(transfer => {
                                source.moveCardTo(transfer.card, target);
                                return state;
                            });
                        }
                    });
                }
            });
        }
        // Prism Edge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.IronLeavesex = IronLeavesex;
