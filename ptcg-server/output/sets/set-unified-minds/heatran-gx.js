"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatranGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HeatranGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = R;
        this.tags = [game_1.CardTag.POKEMON_GX];
        this.hp = 190;
        this.stage = game_1.Stage.BASIC;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Burning Road',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from your Bench to become your Active Pokémon, you may move any number of [R] Energy from your other Pokémon to it.'
            }];
        this.attacks = [{
                name: 'Steaming Stomp',
                cost: [R, R, C],
                damage: 130,
                text: ''
            },
            {
                name: 'Hot Burn-GX',
                cost: [R],
                damage: 50,
                damageCalculation: 'x',
                gxAttack: true,
                text: 'This attack does 50 damage times the amount of [R] Energy attached to this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Heatran-GX';
        this.fullName = 'Heatran-GX UNM';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = state.players[state.activePlayer];
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
            this.movedToActiveThisTurn = false;
        }
        const cardList = game_1.StateUtils.findCardList(state, this);
        const owner = game_1.StateUtils.findOwner(state, cardList);
        const player = state.players[state.activePlayer];
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            this.movedToActiveThisTurn = false;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            if (this.movedToActiveThisTurn == true) {
                player.marker.addMarker(this.ABILITY_USED_MARKER, this);
                // Try to reduce PowerEffect, to check if something is blocking our ability
                if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    return state;
                }
                const blockedFrom = [];
                const blockedTo = [];
                const blockedMap = [];
                let hasEnergyOnBench = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList === player.active) {
                        blockedFrom.push(target);
                        return;
                    }
                    blockedTo.push(target);
                    // Block energy that doesn't provide FIRE or ANY
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const blockedCards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (!em.provides.includes(game_1.CardType.FIRE) && !em.provides.includes(game_1.CardType.ANY)) {
                            blockedCards.push(em.card);
                        }
                    });
                    const blocked = [];
                    blockedCards.forEach(bc => {
                        const index = cardList.cards.indexOf(bc);
                        if (index !== -1 && !blocked.includes(index)) {
                            blocked.push(index);
                        }
                    });
                    if (blocked.length > 0) {
                        blockedMap.push({ source: target, blocked });
                    }
                    if (cardList.cards.some(c => c.superType === game_1.SuperType.ENERGY && (c.provides.includes(game_1.CardType.FIRE) || c.provides.includes(game_1.CardType.ANY)))) {
                        hasEnergyOnBench = true;
                    }
                });
                if (hasEnergyOnBench === false) {
                    return state;
                }
                return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
                { superType: game_1.SuperType.ENERGY }, { allowCancel: false, blockedTo, blockedFrom, blockedMap }), transfers => {
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
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check if player has used GX attack
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // set GX attack as used for game
            player.usedGX = true;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === game_1.CardType.FIRE || cardType === game_1.CardType.ANY;
                }).length;
            });
            effect.damage = energyCount * 50;
        }
        return state;
    }
}
exports.HeatranGX = HeatranGX;
