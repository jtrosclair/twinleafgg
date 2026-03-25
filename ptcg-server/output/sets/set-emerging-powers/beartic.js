"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beartic = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Beartic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cubchoo';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Icy Wind',
                cost: [W],
                damage: 30,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Superpower',
                cost: [W, W, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may do 20 more damage. If you do, this Pokémon does 20 damage to itself.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Beartic';
        this.fullName = 'Beartic EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return store.prompt(state, new confirm_prompt_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), result => {
                if (result) {
                    effect.damage += 20;
                    (0, prefabs_2.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
                }
            });
        }
        return state;
    }
}
exports.Beartic = Beartic;
