"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chandelure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chandelure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lampent';
        this.hp = 140;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Eerie Glow',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 130,
                text: 'Your opponent\'s Active Pokémon is now Burned and Confused.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Chandelure';
        this.fullName = 'Chandelure 30C';
    }
    reduceEffect(store, state, effect) {
        // Eerie Glow
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        return state;
    }
}
exports.Chandelure = Chandelure;
