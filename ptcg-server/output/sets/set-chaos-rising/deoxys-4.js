"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deoxys4 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Deoxys4 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Psy Speed',
                cost: [P],
                damage: 30,
                text: 'You may draw cards until you have 5 cards in your hand.'
            }
        ];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Deoxys';
        this.fullName = 'Deoxys M4 34';
    }
    reduceEffect(store, state, effect) {
        // Attack: Psy Speed - optional draw until 5 cards
        // Ref: set-chilling-reign/tapu-fini.ts (optional effect with ConfirmPrompt)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_DRAW_CARDS), wantToDraw => {
                if (wantToDraw) {
                    (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 5);
                }
            });
        }
        return state;
    }
}
exports.Deoxys4 = Deoxys4;
