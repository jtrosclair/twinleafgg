"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munna = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Munna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Sleep Inducer',
                cost: [C],
                damage: 0,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Asleep.'
            },
            {
                name: 'Hypnotic Ray',
                cost: [P, C, C],
                damage: 30,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Munna';
        this.fullName = 'Munna BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    opponent.switchPokemon(targets[0]);
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Munna = Munna;
