"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cosmoem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cosmoem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cosmog';
        this.hp = 100;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Stiffen',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your opponent\'s next turn, this Pokémon takes 60 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Cosmoem';
        this.fullName = 'Cosmoem 30C';
    }
    reduceEffect(store, state, effect) {
        // Stiffen
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.player.active.damageReductionNextTurn = 60;
        }
        return state;
    }
}
exports.Cosmoem = Cosmoem;
