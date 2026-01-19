"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Onix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Thumpalanche',
                cost: [C, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Discard the top 5 cards of your deck. This attack does 80 damage for each Pokémon with a Retreat Cost of exactly 4 that you discarded in this way.',
            },
            {
                name: 'Heavy Impact',
                cost: [F, F, C, C],
                damage: 100,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Onix';
        this.fullName = 'Onix MEW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            const mistysPokemon = deckTop.cards.filter(c => c.retreat.length === 4);
            effect.damage = 80 * mistysPokemon.length;
            deckTop.moveTo(player.discard, deckTop.cards.length);
        }
        return state;
    }
}
exports.Onix = Onix;
