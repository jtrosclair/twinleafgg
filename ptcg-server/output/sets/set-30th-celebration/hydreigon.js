"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Hydreigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.hp = 170;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tri-Bite',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Toss 3 coins. For each heads, pick an Energy attached to your opponent\'s Active Pokémon and discard it.'
            },
            {
                name: 'Pitch-Black Fangs',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon 30C';
    }
    reduceEffect(store, state, effect) {
        // Tri-Bite
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                if (heads > 0) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect, undefined, heads);
                }
            });
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
