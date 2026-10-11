"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lycanroc = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lycanroc extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rockruff';
        this.hp = 130;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Counter',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                damageCalculation: '+',
                text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does that much more damage.'
            },
            {
                name: 'Boulder Crush',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Lycanroc';
        this.fullName = 'Lycanroc 30C';
    }
    reduceEffect(store, state, effect) {
        // Counter
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const activeCard = effect.player.active.getPokemonCard();
            if (activeCard !== undefined && activeCard.damageTakenLastTurn !== undefined) {
                effect.damage += activeCard.damageTakenLastTurn;
            }
        }
        return state;
    }
}
exports.Lycanroc = Lycanroc;
