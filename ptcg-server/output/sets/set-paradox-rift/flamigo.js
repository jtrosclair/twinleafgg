"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flamigo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flamigo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Peck',
                cost: [F],
                damage: 30,
                text: ''
            },
            {
                name: 'Combat Beak',
                cost: [F, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Flamigo';
        this.fullName = 'Flamigo PAR';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 20 * opponentBench);
        }
        return state;
    }
}
exports.Flamigo = Flamigo;
