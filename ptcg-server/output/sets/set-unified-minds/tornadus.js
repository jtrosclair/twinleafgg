"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tornadus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tornadus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Knuckle Punch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Thunderous Tornado',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If Thundurus is on your Bench, this attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '178';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tornadus';
        this.fullName = 'Tornadus UNM';
    }
    reduceEffect(store, state, effect) {
        // Thunderous Tornado
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check for Thundurus on your Bench
            const hasThundurus = player.bench.some(b => b.cards.length > 0 && b.cards[0].name.toLowerCase().includes('thundurus'));
            if (hasThundurus) {
                const opponent = effect.opponent;
                for (const bench of opponent.bench) {
                    if (bench.cards.length > 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                        damageEffect.target = bench;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.Tornadus = Tornadus;
