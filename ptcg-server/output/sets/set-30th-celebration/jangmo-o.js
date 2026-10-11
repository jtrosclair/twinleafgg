"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JangmoO = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
class JangmoO extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.DRAGON;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Screech',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your next turn, the Defending Pokémon takes 30 more damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Dragon Claw',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Jangmo-o';
        this.fullName = 'Jangmo-o 30C';
    }
    reduceEffect(store, state, effect) {
        // Screech
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, effect_of_attack_prefabs_1.DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN)(store, state, effect, this, 30);
        }
        return state;
    }
}
exports.JangmoO = JangmoO;
