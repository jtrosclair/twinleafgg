"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emolga = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Emolga extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = L;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Minor Errand Running',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Sky Return',
                cost: [L],
                damage: 30,
                text: 'Return this Pokemon and all cards attached to your hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Emolga';
        this.fullName = 'Emolga M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }, this.attacks[0]);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, attack_effects_1.PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND)(store, state, effect);
        }
        return state;
    }
}
exports.Emolga = Emolga;
