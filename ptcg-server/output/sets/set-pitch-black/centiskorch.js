"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centiskorch = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Centiskorch extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sizzlipede';
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Controlled Burn',
                cost: [R],
                damage: 0,
                text: 'Discard 2 cards from your opponent\'s deck.',
            },
            {
                name: 'Heat Tackle',
                cost: [R, C, C, C],
                damage: 160,
                text: 'This Pokémon also does 30 damage to itself.',
            }];
        this.set = 'M5';
        this.setNumber = '9';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Centiskorch';
        this.fullName = 'Centiskorch M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, effect.player, 2, this, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Centiskorch = Centiskorch;
