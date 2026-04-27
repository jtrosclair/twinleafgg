"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCenterLady = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class PokemonCenterLady extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEG';
        this.setNumber = '123';
        this.regulationMark = 'I';
        this.name = 'Pokémon Center Lady';
        this.fullName = 'Pokémon Center Lady M1S';
        this.text = 'Heal 60 damage from 1 of your Pokémon, and it recovers from all Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const target = targets[0];
                    const healEffect = new game_effects_1.HealEffect(player, target, 60);
                    store.reduceEffect(state, healEffect);
                    target.specialConditions = [];
                }
            });
        }
        return state;
    }
}
exports.PokemonCenterLady = PokemonCenterLady;
