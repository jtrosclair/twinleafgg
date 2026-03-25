"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Audino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Heal Pulse',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Return',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the number of your Benched Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '85';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Audino';
        this.fullName = 'Audino NVI';
    }
    reduceEffect(store, state, effect) {
        // Heal Pulse
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        // Return - 10x number of benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const benchCount = player.bench.filter(b => b.cards.length > 0).length;
            effect.damage = 10 * benchCount;
        }
        return state;
    }
}
exports.Audino = Audino;
