"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektross = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eelektross extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.cardType = L;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Electric Swamp',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn (before your attack), if this Pokémon is in your hand and you have at least 4 [L] Energy cards in play, you may play this Pokémon onto your Bench. If you do, move any number of [L] Energy from your other Pokémon to this Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Hover Over',
                cost: [L, C, C, C],
                damage: 130,
                text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn',
            }
        ];
        this.set = 'UNM';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektross';
        this.fullName = 'Eelektross UNM';
    }
    reduceEffect(store, state, effect) {
        // Electric Swamp
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            // Can't bench this Pokemon unless we have 4 Lightning Energy cards in play.
            const energyCards = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.filter(c => ((c instanceof game_1.EnergyCard) && (!energyCards.includes(c)) &&
                    (c.provides.includes(game_1.CardType.LIGHTNING) || c.provides.includes(game_1.CardType.ANY)))).forEach(c => energyCards.push(c));
            });
            if (energyCards.length < 4)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            // Bench this Pokemon to the desired slot.
            prefabs_1.PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
            // Then, prompt player to move Lightning energy from their other Pokemon to this one.
            const blockedFrom = [];
            const blockedTo = [];
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                // We can only move from other Pokemon to this one.
                if (card === this) {
                    blockedFrom.push(target);
                }
                else {
                    blockedTo.push(target);
                }
                const blocked = [];
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(game_1.CardType.LIGHTNING) && !em.provides.includes(game_1.CardType.ANY)) {
                        const index = cardList.cards.indexOf(em.card);
                        if (index !== -1 && !blocked.includes(index)) {
                            blocked.push(index);
                        }
                    }
                });
                if (blocked.length !== 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: true, blockedFrom, blockedTo, blockedMap }), transfers => {
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
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Eelektross = Eelektross;
