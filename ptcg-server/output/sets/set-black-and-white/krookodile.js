"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krookodile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Krookodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Krokorok';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Foul Play',
                cost: [D],
                damage: 0,
                copycatAttack: true,
                text: 'Choose 1 of the Defending Pokémon\'s attacks and use it as this attack.'
            },
            {
                name: 'Bombast',
                cost: [D, D, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 40 more damage for each Prize card you have taken.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Krookodile';
        this.fullName = 'Krookodile BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COPY_OPPONENT_ACTIVE_ATTACK)(store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const prizesTaken = 6 - player.getPrizeLeft();
            effect.damage += 40 * prizesTaken;
        }
        return state;
    }
}
exports.Krookodile = Krookodile;
