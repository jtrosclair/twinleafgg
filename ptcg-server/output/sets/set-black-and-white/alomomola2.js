"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alomomola2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Alomomola2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Water Pulse',
                cost: [W, C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Hydro Pump',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Alomomola';
        this.fullName = 'Alomomola BLW 39';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let waterEnergy = 0;
            player.active.cards.forEach(card => {
                if (card.superType === card_types_1.SuperType.ENERGY) {
                    waterEnergy += card.provides.filter(e => e === card_types_1.CardType.WATER).length;
                }
            });
            effect.damage += 10 * waterEnergy;
        }
        return state;
    }
}
exports.Alomomola2 = Alomomola2;
