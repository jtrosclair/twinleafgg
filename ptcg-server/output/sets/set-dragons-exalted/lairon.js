"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lairon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lairon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Aron';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Metal Claw',
                cost: [M, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Wreak Havoc',
                cost: [M, M, C],
                damage: 60,
                text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lairon';
        this.fullName = 'Lairon DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, player, (heads) => {
                const cardsToDiscard = Math.min(heads, opponent.deck.cards.length);
                for (let i = 0; i < cardsToDiscard; i++) {
                    opponent.deck.moveTo(opponent.discard, 1);
                }
            });
        }
        return state;
    }
}
exports.Lairon = Lairon;
