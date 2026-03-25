"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Cofagrigus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Damagriiigus',
                cost: [P],
                damage: 0,
                text: 'Move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
            },
            {
                name: 'Perplex',
                cost: [P, C, C],
                damage: 30,
                text: 'The Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus NVI';
    }
    reduceEffect(store, state, effect) {
        // Damagriiigus - move up to 3 damage counters from your Pokémon to opponent's
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if any of player's Pokémon has damage
            const damagedPokemon = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.damage > 0) {
                    damagedPokemon.push(cardList);
                }
            });
            if (damagedPokemon.length === 0) {
                return state;
            }
            // Choose source Pokémon
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), sourceTargets => {
                if (!sourceTargets || sourceTargets.length === 0) {
                    return;
                }
                const source = sourceTargets[0];
                if (source.damage === 0) {
                    return;
                }
                // Calculate how many damage counters can be moved (max 3)
                const maxCounters = Math.min(3, Math.floor(source.damage / 10));
                // Choose target Pokémon
                store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), targetTargets => {
                    if (!targetTargets || targetTargets.length === 0) {
                        return;
                    }
                    const target = targetTargets[0];
                    // Move up to 3 damage counters
                    const damageToMove = maxCounters * 10;
                    source.damage -= damageToMove;
                    target.damage += damageToMove;
                });
            });
        }
        // Perplex
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, addSpecialCondition);
        }
        return state;
    }
}
exports.Cofagrigus = Cofagrigus;
