"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageMover = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DamageMover extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Damage Mover';
        this.fullName = 'Damage Mover SLG';
        this.text = 'Move 3 damage counters from 1 of your Pokémon to 1 of your other Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if any Pokémon have damage
            let hasDamagedPokemon = false;
            const damagedPokemon = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    hasDamagedPokemon = true;
                    damagedPokemon.push({ target, damage: cardList.damage });
                }
            });
            if (!hasDamagedPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const maxAllowedDamage = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            effect.preventDefault = true;
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 1, allowCancel: false, blockedFrom: [], blockedTo: [], singleSourceTarget: true, singleDestinationTarget: true }), transfers => {
                if (transfers === null) {
                    player.hand.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (source && target && source !== target && source.damage > 0) {
                        // Move exactly 3 damage counters (30 damage, or less if source has less than 30)
                        const damageToMove = Math.min(30, source.damage);
                        source.damage -= damageToMove;
                        target.damage += damageToMove;
                    }
                }
                player.hand.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.DamageMover = DamageMover;
