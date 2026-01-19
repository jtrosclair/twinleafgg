"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.WATER, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sleep Powder',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'The Defending Pokémon is now Asleep.',
            },
            {
                name: 'Poison Powder',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'The Defending Pokémon is now Poisoned.',
            }
        ];
        this.set = 'DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Ivysaur = Ivysaur;
