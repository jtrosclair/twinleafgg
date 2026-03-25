"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yamask = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yamask extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Transfer Pain',
                cost: [P],
                damage: 0,
                text: 'Move 1 damage counter from any of your Pokémon to any of your opponent\'s Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Yamask';
        this.fullName = 'Yamask PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Transfer Pain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if any of player's Pokemon have damage
            let hasDamaged = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.damage > 0) {
                    hasDamaged = true;
                }
            });
            if (!hasDamaged) {
                return state;
            }
            // Choose source: one of your Pokemon with damage
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), sourceTargets => {
                if (!sourceTargets || sourceTargets.length === 0) {
                    return;
                }
                const source = sourceTargets[0];
                if (source.damage <= 0) {
                    return;
                }
                // Choose target: one of opponent's Pokemon
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targetTargets => {
                    if (!targetTargets || targetTargets.length === 0) {
                        return;
                    }
                    const target = targetTargets[0];
                    // Remove 1 damage counter from source
                    source.damage -= 10;
                    // Put 1 damage counter on target
                    const putCounters = new attack_effects_1.PutCountersEffect(effect, 10);
                    putCounters.target = target;
                    store.reduceEffect(state, putCounters);
                });
            });
        }
        return state;
    }
}
exports.Yamask = Yamask;
