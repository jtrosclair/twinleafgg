"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swoobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swoobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Woobat';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Gust',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Heart Stamp',
                cost: [P, C, C],
                damage: 60,
                text: 'Flip a coin. If heads, your opponent shuffles his or her hand into his or her deck.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Swoobat';
        this.fullName = 'Swoobat BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    // Shuffle opponent's hand into deck
                    opponent.hand.moveTo(opponent.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                }
            });
        }
        return state;
    }
}
exports.Swoobat = Swoobat;
