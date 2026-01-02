"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.PLAY_DURING_SETUP];
        this.evolvesFrom = 'Luxio';
        this.cardType = L;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Explosiveness',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Seeking Fang',
                cost: [C],
                damage: 50,
                text: 'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Luxray';
        this.fullName = 'Luxray CRZ';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2 }, this.attacks[0]);
        }
        return state;
    }
}
exports.Luxray = Luxray;
