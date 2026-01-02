"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RayquazaEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Intensifying Burn',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon-EX, this attack does 50 more damage.'
            }, {
                name: 'Dragon Pulse',
                cost: [C, C, C],
                damage: 100,
                text: 'Discard the top 3 cards of your deck.'
            },
        ];
        this.set = 'ROS';
        this.name = 'Rayquaza-EX';
        this.fullName = 'Rayquaza EX ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Intensifying Burn
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if ((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                effect.damage += 50;
            }
        }
        // Dragon Pulse
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.MOVE_CARDS(store, state, effect.player.deck, effect.player.discard, { count: 3 });
        }
        return state;
    }
}
exports.RayquazaEx = RayquazaEx;
