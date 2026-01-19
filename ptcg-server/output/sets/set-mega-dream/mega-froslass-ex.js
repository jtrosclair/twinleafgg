"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaFroslassex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class MegaFroslassex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 310;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rebellion',
                cost: [W],
                damage: 50,
                damageCalculation: 'x',
                text: '50x damage. This attack does 50 damage times the number of cards in your opponent\'s hand.'
            },
            {
                name: 'Absolute Snow',
                cost: [W, C, C],
                damage: 150,
                text: '150 damage. Your opponent\'s Active Pokemon is now Asleep.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Mega Froslass ex';
        this.fullName = 'Mega Froslass ex M2a';
    }
    reduceEffect(store, state, effect) {
        // Rebellion attack - 50x damage based on opponent's hand size
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const handCount = opponent.hand.cards.length;
            effect.damage = 50 * handCount;
        }
        // Absolute Snow attack - 150 damage and put opponent's Active Pokemon to sleep
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.MegaFroslassex = MegaFroslassex;
