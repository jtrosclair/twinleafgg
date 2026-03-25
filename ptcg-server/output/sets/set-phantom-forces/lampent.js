"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lampent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litwick';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Cursed Drop',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokemon ' +
                    'in any way you like.'
            },
            {
                name: 'Night March',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage times the number of Pokemon ' +
                    'in your discard pile that have the Night March attack.'
            }
        ];
        this.set = 'PHF';
        this.name = 'Lampent';
        this.fullName = 'Lampent PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(3, store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'Night March')) {
                    pokemonCount += 1;
                }
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Lampent = Lampent;
