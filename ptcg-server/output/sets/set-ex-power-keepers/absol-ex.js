"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absolex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Absolex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Cursed Eyes',
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Absol ex from your hand onto your Bench, you may move 3 damage counters from 1 of your opponent\'s Pokémon to another of his or her Pokémon.'
            }];
        this.attacks = [{
                name: 'Psychic Pulse',
                cost: [D, C],
                damage: 30,
                text: 'Does 10 damage to each of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PK';
        this.name = 'Absol ex';
        this.fullName = 'Absol ex PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            const maxAllowedDamage = [];
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { min: 0, max: 3, allowCancel: true, singleSourceTarget: true, singleDestinationTarget: true }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    // Check if ability can target the transfer source
                    const canApplyAbilityToSource = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, source);
                    store.reduceEffect(state, canApplyAbilityToSource);
                    // Remove damage if we can target the transfer source
                    if (canApplyAbilityToSource.target && source.damage >= 10) {
                        source.damage -= 10;
                        // Check if ability can target the transfer target
                        const canApplyAbilityToTarget = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, target);
                        store.reduceEffect(state, canApplyAbilityToTarget);
                        // Add damage if we can target the transfer target
                        if (canApplyAbilityToTarget.target) {
                            target.damage += 10;
                        }
                    }
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                if (target.damage !== 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Absolex = Absolex;
