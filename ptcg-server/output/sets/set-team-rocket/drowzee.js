"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drowzee = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Drowzee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Long-Distance Hypnosis',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Asleep; if tails, your Active Pokémon is now Asleep. The power can\'t be used if Drowzee is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Nightmare',
                cost: [P, C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'TR';
        this.name = 'Drowzee';
        this.fullName = 'Drowzee TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.HYPNOSIS_MARKER = 'HYPNOSIS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.HYPNOSIS_MARKER, effect.player, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.HYPNOSIS_MARKER, player, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.HYPNOSIS_MARKER, player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
                else {
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, player, this);
                }
            });
            return state;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Drowzee = Drowzee;
