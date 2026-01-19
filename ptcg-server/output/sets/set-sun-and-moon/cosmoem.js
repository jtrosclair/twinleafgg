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
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Teleport',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Switch this Pokémon with one of your Benched Pokémon.'
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Cosmoem';
        this.fullName = 'Cosmoem SUM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        return state;
    }
}
exports.Cosmoem = Cosmoem;
