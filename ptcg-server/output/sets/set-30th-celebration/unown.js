"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unown = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Unown extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mysterious Signal',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 40,
                text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Unown';
        this.fullName = 'Unown 30C';
    }
    reduceEffect(store, state, effect) {
        // Mysterious Signal
        return (0, prefabs_1.IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES)(store, state, effect, this, {
            attackName: 'Mysterious Signal',
        });
    }
}
exports.Unown = Unown;
