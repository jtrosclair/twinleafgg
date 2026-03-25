"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowscarada = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Meowscarada extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Floragato';
        this.cardType = G;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Trick Cape',
                cost: [C],
                damage: 40,
                text: 'You may put an Energy attached to your opponent\'s Active Pokémon into their hand.'
            },
            {
                name: 'Flower Blast',
                cost: [G, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meowscarada';
        this.fullName = 'Meowscarada SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_1.PUT_ENERGY_FROM_OPPONENTS_ACTIVE_INTO_THEIR_HAND)(store, state, effect);
        }
        return state;
    }
}
exports.Meowscarada = Meowscarada;
