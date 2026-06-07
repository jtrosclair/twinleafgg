"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spritzee = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spritzee extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sweet Scent',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from 1 of your Pokemon.'
            },
            {
                name: 'Ram',
                cost: [P],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.usSetNumber = 'POR 35';
        this.name = 'Spritzee';
        this.fullName = 'Spritzee M3';
    }
    reduceEffect(store, state, effect) {
        // Sweet Scent - Heal 30 from 1 Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, targets[0], 30);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Spritzee = Spritzee;
