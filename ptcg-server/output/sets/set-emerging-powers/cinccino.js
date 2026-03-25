"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinccino = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Cinccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Minccino';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Captivate',
                cost: [C],
                damage: 0,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Fluffy Tail',
                cost: [C, C],
                damage: 30,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Cinccino';
        this.fullName = 'Cinccino EPO';
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
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Cinccino = Cinccino;
