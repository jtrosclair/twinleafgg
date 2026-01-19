"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zubat extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Revealing Echo',
                powerType: game_2.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may have your opponent reveal their hand.'
            }];
        this.attacks = [{
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zubat';
        this.fullName = 'Zubat MEW';
        this.REVEALING_ECHO_MARKER = 'REVEALING_ECHO_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.REVEALING_ECHO_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponent.hand.cards);
            (0, prefabs_1.ADD_MARKER)(this.REVEALING_ECHO_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.REVEALING_ECHO_MARKER, this);
        return state;
    }
}
exports.Zubat = Zubat;
