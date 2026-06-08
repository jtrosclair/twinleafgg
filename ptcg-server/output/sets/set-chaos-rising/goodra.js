"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goodra = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const GOODRA_SLIMY_SLIP_ALLOWED = 'GOODRA_SLIMY_SLIP_ALLOWED';
class Goodra extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Sliggoo';
        this.hp = 160;
        this.cardType = N;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Slimy Slip',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When your opponent\'s Active Pokemon retreats, they flip a coin. If tails, that retreat fails and no Energy is discarded.'
            }];
        this.attacks = [{
                name: 'Dragon Pulse',
                cost: [N, N, C],
                damage: 160,
                text: 'Discard the top card of your deck.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.usSetNumber = 'CRI 68';
        this.name = 'Goodra';
        this.fullName = 'Goodra M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.RetreatEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(GOODRA_SLIMY_SLIP_ALLOWED)) {
                (0, prefabs_1.REMOVE_MARKER)(GOODRA_SLIMY_SLIP_ALLOWED, player);
                return state;
            }
            let isGoodraInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this)
                    isGoodraInPlay = true;
            });
            if (isGoodraInPlay) {
                effect.preventDefault = true;
                return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (!result) {
                        throw new game_2.GameError(game_2.GameMessage.BLOCKED_BY_ABILITY);
                    }
                    (0, prefabs_1.ADD_MARKER)(GOODRA_SLIMY_SLIP_ALLOWED, player, this);
                    effect.preventDefault = false;
                    store.reduceEffect(state, effect);
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, effect.player, 1, this, effect);
        }
        return state;
    }
}
exports.Goodra = Goodra;
