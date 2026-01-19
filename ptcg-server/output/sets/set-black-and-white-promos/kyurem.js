"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyurem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kyurem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Outrage',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Glaciate',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'BWP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Kyurem';
        this.fullName = 'Kyurem BWP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const damageCounters = effect.player.active.damage;
            effect.damage += damageCounters * 10;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 80);
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 80);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Kyurem = Kyurem;
