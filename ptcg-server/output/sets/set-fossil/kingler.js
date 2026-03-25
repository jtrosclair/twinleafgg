"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingler = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kingler extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Krabby';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Flail',
                cost: [W],
                damage: 10,
                text: 'Does 10 damage times the number of damage counters on Kingler.'
            },
            {
                name: 'Crabhammer',
                cost: [W, W, C],
                damage: 40,
                text: ''
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Kingler';
        this.fullName = 'Kingler FO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage = player.active.damage;
            return state;
        }
        return state;
    }
}
exports.Kingler = Kingler;
