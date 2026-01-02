"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsChingling = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsChingling extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Ring Ring Noise',
                cost: [],
                damage: 0,
                text: 'Discard a random card from your opponent\'s hand.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '85';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Chingling';
        this.fullName = 'Team Rocket\'s Chingling DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                prefabs_1.MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[0] });
            }
        }
        return state;
    }
}
exports.TeamRocketsChingling = TeamRocketsChingling;
