"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sneasel';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Claws of Retribution',
                cost: [D, D],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon has 50 HP or less remaining, this attack does 170 more damage.',
            },
            {
                name: 'Cut',
                cost: [D, D],
                damage: 60,
                text: '',
            }];
        this.set = 'MEP';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Weavile';
        this.fullName = 'Weavile M2';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.active.hp <= 50) {
                effect.damage += 170;
            }
        }
        return state;
    }
}
exports.Weavile = Weavile;
