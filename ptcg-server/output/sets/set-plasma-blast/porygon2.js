"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Porygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Porygon';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Destructive Beam',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Porygon2';
        this.fullName = 'Porygon2 PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Porygon2 = Porygon2;
