"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serperior2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Serperior2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Servine';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Royal Heal',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'At any time between turns, heal 10 damage from each of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Leaf Tornado',
                cost: [G, C],
                damage: 60,
                text: 'Move as many [G] Energy attached to your Pokémon to your other Pokémon in any way you like.'
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Serperior';
        this.fullName = 'Serperior BLW 6';
    }
    reduceEffect(store, state, effect) {
        // Royal Heal - Between turns healing
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            // Check if this Serperior is in play for this player
            let hasSerperior = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                        hasSerperior = true;
                    }
                }
            });
            if (hasSerperior) {
                // Heal 10 from each of this player's Pokémon
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.damage > 0) {
                        cardList.damage = Math.max(0, cardList.damage - 10);
                    }
                });
            }
        }
        // Leaf Tornado - Move Grass Energy around
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Build blocked map - only allow moving Grass energy
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blocked = [];
                cardList.cards.forEach((c, index) => {
                    // Block cards that are not Grass energy
                    if (c.superType === card_types_1.SuperType.ENERGY) {
                        const energyMap = checkProvidedEnergy.energyMap.find(em => em.card === c);
                        if (!energyMap || (!energyMap.provides.includes(card_types_1.CardType.GRASS) && !energyMap.provides.includes(card_types_1.CardType.ANY))) {
                            blocked.push(index);
                        }
                    }
                });
                if (blocked.length > 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            // Check if there's any Grass energy to move
            let hasGrassEnergy = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (em.provides.includes(card_types_1.CardType.GRASS) || em.provides.includes(card_types_1.CardType.ANY)) {
                        hasGrassEnergy = true;
                    }
                });
            });
            if (!hasGrassEnergy) {
                return state;
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Serperior2 = Serperior2;
