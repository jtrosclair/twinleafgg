"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ursaluna = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ursaluna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ursaring';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Peat Hunt',
                damage: 0,
                cost: [card_types_1.CardType.COLORLESS],
                text: 'Put up to 2 cards from your discard pile into your hand.'
            },
            {
                name: 'Bulky Bump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Ursaluna';
        this.fullName = 'Ursaluna ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 0, max: 2, allowCancel: false }, this.attacks[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Ursaluna = Ursaluna;
