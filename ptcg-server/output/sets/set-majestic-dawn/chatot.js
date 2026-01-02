"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatot = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chatot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L, value: +20 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Mimic',
                cost: [],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw a number of cards equal to the number of cards in your opponent\'s hand.'
            },
            {
                name: 'Chatter',
                cost: [C, C],
                damage: 20,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Chatot';
        this.fullName = 'Chatot MD';
        this.CHATTER_MARKER = 'CHATTER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.MOVE_CARDS(store, state, player.hand, player.deck);
            prefabs_1.SHUFFLE_DECK(store, state, player);
            prefabs_1.DRAW_CARDS(player, opponent.hand.cards.length);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Chatot = Chatot;
