"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Watch and Learn',
                cost: [F, C],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
            }];
        this.set = 'BKP';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo BKP';
    }
    // Ref: set-team-up/mimikyu.ts (Copycat)
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COPY_OPPONENTS_LAST_ATTACK)(store, state, effect);
        }
        return state;
    }
}
exports.Sudowoodo = Sudowoodo;
