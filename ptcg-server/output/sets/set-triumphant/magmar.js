"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magmar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Eruption',
                cost: [R],
                damage: 20,
                damageCalculation: 'x',
                text: 'Each player discards the top card of his or her deck. This attack does 20 damage times the number of Energy cards discarded in this way.'
            },
            {
                name: 'Combustion',
                cost: [R, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Magmar';
        this.fullName = 'Magmar TM';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Ground Burn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerTopDeck = new game_1.CardList();
            const opponentTopDeck = new game_1.CardList();
            let damageScaling = 0;
            player.deck.moveTo(playerTopDeck, 1);
            opponent.deck.moveTo(opponentTopDeck, 1);
            if (((_a = playerTopDeck.cards[0]) === null || _a === void 0 ? void 0 : _a.superType) === game_1.SuperType.ENERGY) {
                damageScaling++;
            }
            if (((_b = opponentTopDeck.cards[0]) === null || _b === void 0 ? void 0 : _b.superType) === game_1.SuperType.ENERGY) {
                damageScaling++;
            }
            effect.damage = 20 * damageScaling;
            playerTopDeck.moveTo(player.discard);
            opponentTopDeck.moveTo(opponent.discard);
        }
        return state;
    }
}
exports.Magmar = Magmar;
