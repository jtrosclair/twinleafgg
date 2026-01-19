"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Teleportation Burst',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Switch this Pokemon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Ralts';
        this.fullName = 'Ralts ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        return state;
    }
}
exports.Ralts = Ralts;
