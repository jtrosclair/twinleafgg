"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oddish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Oddish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sweet Scent',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from 1 of your Pokémon.'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Oddish';
        this.fullName = 'Oddish CEC';
    }
    reduceEffect(store, state, effect) {
        // Sweet Scent
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), results => {
                const targets = results || [];
                if (targets.length >= 0) {
                    const healEffect = new game_effects_1.HealEffect(player, targets[0], 30);
                    store.reduceEffect(state, healEffect);
                }
                return state;
            });
        }
        return state;
    }
}
exports.Oddish = Oddish;
