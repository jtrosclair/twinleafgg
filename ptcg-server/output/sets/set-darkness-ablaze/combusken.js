"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combusken = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Combusken extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Torchic';
        this.attacks = [{
                name: 'Smash Kick',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: ''
            },
            {
                name: 'Heat Beak',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Combusken';
        this.fullName = 'Combusken DAA';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 1, this)) {
            prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Combusken = Combusken;
