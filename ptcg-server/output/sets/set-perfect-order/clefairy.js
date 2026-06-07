"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clefairy = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Clefairy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Follow Me',
                cost: [P],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon.'
            },
            {
                name: 'Flop',
                cost: [P, P],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.usSetNumber = 'POR 30';
        this.name = 'Clefairy';
        this.fullName = 'Clefairy M3';
    }
    reduceEffect(store, state, effect) {
        // Follow Me - Switch opponent's Benched with Active
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent has benched Pokemon
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                }
            });
        }
        return state;
    }
}
exports.Clefairy = Clefairy;
