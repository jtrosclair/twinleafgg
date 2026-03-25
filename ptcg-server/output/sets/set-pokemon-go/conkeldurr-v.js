"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConkeldurrV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ConkeldurrV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Counter',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does that much more damage.'
            },
            {
                name: 'Dynamic Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Conkeldurr V';
        this.fullName = 'Conkeldurr V PGO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const activeCard = effect.player.active.getPokemonCard();
            if (activeCard !== undefined && activeCard.damageTakenLastTurn !== undefined) {
                effect.damage += activeCard.damageTakenLastTurn;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(effect.player, (result) => {
                if (result) {
                    effect.damage += 90;
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                    state = store.reduceEffect(state, specialConditionEffect);
                }
            });
            state = store.reduceEffect(state, coinFlipEffect);
        }
        return state;
    }
}
exports.ConkeldurrV = ConkeldurrV;
