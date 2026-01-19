"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aromatisse = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Aromatisse extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spritzee';
        this.cardType = Y;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Fairy Transfer',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), you may move a [Y] Energy attached to 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Fairy Wind',
                cost: [Y, Y, C],
                damage: 60,
                text: ''
            }];
        this.set = 'XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Aromatisse';
        this.fullName = 'Aromatisse XY';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(card_types_1.CardType.FAIRY) && !em.provides.includes(card_types_1.CardType.ANY)) {
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
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap }), transfers => {
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
        }
        return state;
    }
}
exports.Aromatisse = Aromatisse;
