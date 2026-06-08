"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gourgeistex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gourgeistex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pumpkaboo';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Horror Rondo',
                cost: [P],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each of your Benched Pokemon that have any damage counters on them.'
            },
            {
                name: 'Ghost Touch',
                cost: [P, P],
                damage: 140,
                text: 'Discard a random card from your opponent\'s hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.usSetNumber = 'POR 41';
        this.name = 'Gourgeist ex';
        this.fullName = 'Gourgeist ex M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let benchWithDamageCount = 0;
            player.bench.forEach(slot => {
                if (slot.cards.length > 0 && slot.damage > 0) {
                    benchWithDamageCount++;
                }
            });
            effect.damage += 50 * benchWithDamageCount;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Gourgeistex = Gourgeistex;
