"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowstic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_2 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useMagicalSwap(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_2.CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
            if (source.damage >= 10) {
                source.damage -= 10;
                target.damage += 10;
            }
        }
    });
}
class Meowstic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Espurr';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ear Influence',
                cost: [P],
                damage: 0,
                text: 'Move as many damage counters on your opponent\'s Pokémon as you like to any of your opponent\'s other Pokémon in any way you like.'
            },
            {
                name: 'Psychic',
                cost: [P, P, P],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 10 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'GEN';
        this.setNumber = 'RC15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meowstic';
        this.fullName = 'Meowstic GEN';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useMagicalSwap(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
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
exports.Meowstic = Meowstic;
