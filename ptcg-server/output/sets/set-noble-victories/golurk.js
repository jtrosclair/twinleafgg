"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golurk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golurk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Golett';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Hammer Arm',
                cost: [F, F, C],
                damage: 60,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Hurricane Punch',
                cost: [F, F, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Golurk';
        this.fullName = 'Golurk NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 1 });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Golurk = Golurk;
