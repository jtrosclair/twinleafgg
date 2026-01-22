"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageMover = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
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
            // Count total Pokémon and those with at least 30 damage
            let totalPokemon = 0;
            let pokemonWithDamage = 0;
            const sourceOptions = {
                min: 1,
                max: 1,
                allowCancel: false,
                blocked: []
            };
            // Block Pokémon with less than 30 damage
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                totalPokemon++;
                if (cardList.damage >= 30) {
                    pokemonWithDamage++;
                }
                else {
                    sourceOptions.blocked.push(target);
                }
            });
            // Need at least 2 Pokémon and at least one with 30+ damage
            if (totalPokemon < 2 || pokemonWithDamage === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_WITH_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], sourceOptions), sourceResult => {
                if (sourceResult === null || sourceResult.length === 0) {
                    player.hand.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
                const source = sourceResult[0];
                // Build the blocked list - need to block the source from being a target
                const blockedTargets = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
                    if (cardList === source) {
                        blockedTargets.push(target);
                    }
                });
                // Prompt to choose target (any other Pokémon)
                const targetOptions = {
                    min: 1,
                    max: 1,
                    allowCancel: false,
                    blocked: blockedTargets
                };
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_MOVE_DAMAGE_TO, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], targetOptions), targetResult => {
                    if (targetResult === null || targetResult.length === 0) {
                        player.hand.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    }
                    const target = targetResult[0];
                    // Move 30 damage from source to target
                    source.damage -= 30;
                    target.damage += 30;
                    player.hand.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.DamageMover = DamageMover;
