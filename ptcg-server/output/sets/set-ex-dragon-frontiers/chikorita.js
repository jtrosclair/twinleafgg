"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chikorita = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chikorita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Sleep Powder',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'DF';
        this.name = 'Chikorita';
        this.fullName = 'Chikorita DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Chikorita = Chikorita;
