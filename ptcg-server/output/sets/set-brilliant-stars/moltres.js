"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Inferno Wings',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon has any damage counters on it, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
            }];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Moltres';
        this.fullName = 'Moltres BRS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const source = player.active;
            // Check if source Pokemon has damage
            const damage = source.damage;
            if (damage > 0) {
                effect.damage += 70;
            }
            return state;
        }
        return state;
    }
}
exports.Moltres = Moltres;
