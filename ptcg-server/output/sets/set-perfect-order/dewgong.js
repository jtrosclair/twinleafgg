"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dewgong = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dewgong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Seel';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Wash Out',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may move a [W] Energy from your Benched Pokemon to your Active Pokemon.'
            }];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W, W],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.usSetNumber = 'POR 19';
        this.name = 'Dewgong';
        this.fullName = 'Dewgong M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if there's any [W] Energy on benched Pokemon
            let hasWaterEnergyOnBench = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList !== player.active) {
                    const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkEnergy);
                    if (checkEnergy.energyMap.some(em => em.provides.includes(card_types_1.CardType.WATER))) {
                        hasWaterEnergyOnBench = true;
                    }
                }
            });
            if (!hasWaterEnergyOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blockedFrom = [];
            const blockedTo = [];
            // Block active Pokemon as source
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList === player.active) {
                    blockedFrom.push(target);
                }
                else {
                    blockedTo.push(target);
                }
            });
            // Block bench Pokemon as destination
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList !== player.active) {
                    blockedTo.push(target);
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1, blockedFrom, blockedTo }), transfers => {
                if (!transfers || transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    // Verify it's a Water Energy
                    const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, source);
                    store.reduceEffect(state, checkEnergy);
                    const energyEntry = checkEnergy.energyMap.find(em => em.card === transfer.card);
                    if (!energyEntry || !energyEntry.provides.includes(card_types_1.CardType.WATER)) {
                        continue;
                    }
                    // Move the energy
                    if (source.energies.cards.includes(transfer.card)) {
                        source.energies.moveCardTo(transfer.card, target.energies);
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
            });
        }
        return state;
    }
}
exports.Dewgong = Dewgong;
