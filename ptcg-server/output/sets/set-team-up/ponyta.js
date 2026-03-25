"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ponyta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ponyta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Live Coal',
                cost: [R],
                damage: 10,
                text: ''
            },
            {
                name: 'Stomp',
                cost: [R, R],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }
        ];
        this.set = 'TEU';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ponyta';
        this.fullName = 'Ponyta TEU';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 30;
                }
            });
        }
        return state;
    }
}
exports.Ponyta = Ponyta;
