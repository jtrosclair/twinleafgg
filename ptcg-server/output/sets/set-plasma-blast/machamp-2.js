"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
class Machamp2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Knock Off',
                cost: [F, C, C],
                damage: 60,
                text: 'Discard a random card from your opponent\'s hand.'
            },
            {
                name: 'Reinforced Lariat',
                cost: [F, F, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pok\u00e9mon has a Pok\u00e9mon Tool card attached to it, this attack does 40 more damage.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Machamp';
        this.fullName = 'Machamp PLB 50';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const card = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(card, opponent.discard);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasTool = player.active.cards.some(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL);
            if (hasTool) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Machamp2 = Machamp2;
