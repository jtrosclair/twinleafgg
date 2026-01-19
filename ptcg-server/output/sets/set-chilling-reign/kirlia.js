"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mirage Step',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Search your deck for up to 3 Kirlia and put them onto your Bench. Then, shuffle your deck.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia CRE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { superType: card_types_1.SuperType.POKEMON, name: 'Kirlia' }, { min: 0, max: 3, allowCancel: false });
        }
        return state;
    }
}
exports.Kirlia = Kirlia;
