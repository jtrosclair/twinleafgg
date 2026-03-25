"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroudonStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class GroudonStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STAR];
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Critical Collection',
                cost: [F],
                damage: 0,
                text: 'Count the number of Prize cards your opponent has taken. Search your discard pile for up to that many [F] Energy cards and attach them to Groudon Star.'
            },
            {
                name: 'Ground Slash',
                cost: [F, F, F, C, C],
                damage: 80,
                text: 'Discard a [F] Energy card attached to Groudon Star.'
            }];
        this.set = 'DS';
        this.setNumber = '111';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Groudon Star';
        this.fullName = 'Groudon Star DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON)(store, state, player, 1, card_types_1.CardType.FIGHTING, { destinationSlots: [game_1.SlotType.ACTIVE], min: opponent.prizesTaken, allowCancel: false });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIGHTING);
        }
        return state;
    }
}
exports.GroudonStar = GroudonStar;
