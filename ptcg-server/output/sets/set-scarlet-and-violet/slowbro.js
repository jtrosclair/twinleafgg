"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useDamageSwap(next, store, state, effect) {
    const player = effect.player;
    // Find the CardList of this Pokemon (the one with this power)
    let thisTarget = undefined;
    player.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card === effect.card) {
            thisTarget = target;
        }
    });
    const maxAllowedDamage = [];
    player.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    // Block all "to" targets except thisTarget (the Slowbro with the power)
    const blockedTo = [];
    player.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (thisTarget === undefined || target !== thisTarget) {
            blockedTo.push(target);
        }
    });
    // Block "from" thisTarget (can't move damage from itself to itself)
    const blockedFrom = [];
    if (thisTarget !== undefined) {
        blockedFrom.push(thisTarget);
    }
    return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true, blockedTo, blockedFrom }), transfers => {
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
class Slowbro extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Strange Behavior',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may move 1 damage counter from 1 of your other Pokémon to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Bubble Drain',
                cost: [W, C],
                damage: 60,
                text: 'Heal 30 damage from this Pokémon.'
            }];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const generator = useDamageSwap(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
