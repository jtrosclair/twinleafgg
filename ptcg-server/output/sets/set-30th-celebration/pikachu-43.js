"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu43 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #43 — Tropical Vibes */
class Pikachu43 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tropical Vibes',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'This Pokémon is now Asleep. Draw cards until you have 6 cards in your hand.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 43';
    }
    reduceEffect(store, state, effect) {
        // Tropical Vibes
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
            (0, attack_effects_1.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND)(6, effect, state);
        }
        return state;
    }
}
exports.Pikachu43 = Pikachu43;
