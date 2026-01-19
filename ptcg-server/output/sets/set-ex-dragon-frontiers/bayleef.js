"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayleef = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bayleef extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chikorita';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Poisonpowder',
                cost: [F, C],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned.'
            }];
        this.set = 'DF';
        this.name = 'Bayleef';
        this.fullName = 'Bayleef DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Bayleef = Bayleef;
