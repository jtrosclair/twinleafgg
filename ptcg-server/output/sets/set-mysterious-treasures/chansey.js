"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chansey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F, value: +20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Scrunch',
                cost: [C, C],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to Chansey by attacks during your opponent\'s next turn.'
            },
            {
                name: 'Double-edge',
                cost: [C, C, C, C],
                damage: 80,
                text: 'Chansey does 60 damage to itself.'
            }];
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Chansey';
        this.fullName = 'Chansey MT';
        this.CLEAR_SHELL_HIT_MARKER = 'CLEAR_SHELL_HIT_MARKER';
        this.SHELL_HIT_MARKER = 'SHELL_HIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result)
                    return;
                (0, prefabs_1.ADD_MARKER)(this.SHELL_HIT_MARKER, player.active, this);
                (0, prefabs_1.ADD_MARKER)(this.CLEAR_SHELL_HIT_MARKER, opponent, this);
            });
        }
        (0, prefabs_1.PREVENT_DAMAGE_IF_TARGET_HAS_MARKER)(effect, this.SHELL_HIT_MARKER, this);
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, this.CLEAR_SHELL_HIT_MARKER, this.SHELL_HIT_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 60);
        }
        return state;
    }
}
exports.Chansey = Chansey;
