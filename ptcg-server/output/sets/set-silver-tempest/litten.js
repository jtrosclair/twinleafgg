"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litten = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Litten extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Gnaw',
                cost: [card_types_1.CardType.FIRE],
                damage: 10,
                text: ''
            }, {
                name: 'Reprisal',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each damage counter on this Pokémon.'
            }];
        this.set = 'SIT';
        this.name = 'Litten';
        this.fullName = 'Litten SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            effect.damage = player.active.damage * 2;
        }
        return state;
    }
}
exports.Litten = Litten;
