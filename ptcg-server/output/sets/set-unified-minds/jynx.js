"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jynx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Jynx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ominous Posture',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Attract Smack',
                cost: [P, C],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'UNM';
        this.name = 'Jynx';
        this.fullName = 'Jynx UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.OMINOUS_POSTURE_MARKER = 'OMINOUS_POSTURE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.OMINOUS_POSTURE_MARKER, effect.player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.OMINOUS_POSTURE_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const damagedPokemon = [];
            let hasDamagedPokemon = false;
            if ((0, prefabs_1.HAS_MARKER)(this.OMINOUS_POSTURE_MARKER, player, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    hasDamagedPokemon = true;
                    damagedPokemon.push({ target, damage: cardList.damage });
                }
            });
            if (!hasDamagedPokemon) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const maxAllowedDamage = [];
            opponent.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true, min: 1, max: 1 }), transfers => {
                (0, prefabs_1.ADD_MARKER)(this.OMINOUS_POSTURE_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
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
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.Jynx = Jynx;
