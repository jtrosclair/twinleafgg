"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorina = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidorina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P, value: +20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rescue',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for up to 2 Pokémon, show them to your opponent, and put them into your hand.'
            },
            {
                name: 'Scratch',
                cost: [P, C],
                damage: 30,
                text: ''
            }];
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Nidorina';
        this.fullName = 'Nidorina MT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 2 }, this.attacks[0]);
        }
        return state;
    }
}
exports.Nidorina = Nidorina;
