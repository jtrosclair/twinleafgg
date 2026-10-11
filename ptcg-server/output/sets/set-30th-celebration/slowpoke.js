"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = card_types_1.CardType.WATER;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Well-Hidden',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            }, {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke 30C';
    }
    reduceEffect(store, state, effect) {
        // Well-Hidden
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, effect_of_attack_prefabs_1.PREVENT_DAMAGE)(store, state, effect, this);
                    (0, effect_of_attack_prefabs_1.PREVENT_EFFECTS_OF_ATTACKS)(store, state, effect, this);
                }
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
