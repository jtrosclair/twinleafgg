"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useDamageSwap(next, store, state, effect) {
    const player = effect.player;
    const maxAllowedDamage = [];
    player.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
            // Check if ability can target the transfer source
            const canApplyAbilityToSource = new game_effects_1.EffectOfAbilityEffect(player, effect.power, effect.card, source);
            store.reduceEffect(state, canApplyAbilityToSource);
            // Remove damage if we can target the transfer source
            if (canApplyAbilityToSource.target && source.damage >= 10) {
                source.damage -= 10;
                // Check if ability can target the transfer target
                const canApplyAbilityToTarget = new game_effects_1.EffectOfAbilityEffect(player, effect.power, effect.card, target);
                store.reduceEffect(state, canApplyAbilityToTarget);
                // Add damage if we can target the transfer target
                if (canApplyAbilityToTarget.target) {
                    target.damage += 10;
                }
            }
        }
    });
}
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Damage Swap',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                text: 'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Psywave',
                cost: [P, P, P],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 10 more damage for each Energy attached to the Defending Pokémon.'
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus BLW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const generator = useDamageSwap(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 10;
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;
