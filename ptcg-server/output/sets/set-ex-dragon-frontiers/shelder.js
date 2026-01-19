"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelder = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shelder extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Shell Grab',
                cost: [F],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Shelder';
        this.fullName = 'Shelder DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Shelder = Shelder;
