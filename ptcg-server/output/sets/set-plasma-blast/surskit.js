"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Surskit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Surskit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sweet Scent',
                cost: [G],
                damage: 0,
                text: 'Heal 20 damage from 1 of your Pokémon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Surskit';
        this.fullName = 'Surskit PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, targets[0], 20);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Surskit = Surskit;
