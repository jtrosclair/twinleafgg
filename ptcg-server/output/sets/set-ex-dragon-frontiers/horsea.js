"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horsea = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Horsea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sleepy Ball',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Horsea';
        this.fullName = 'Horsea DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Horsea = Horsea;
