"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Vine Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Poisonpowder',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'BS';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur BS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, state_utils_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Ivysaur = Ivysaur;
