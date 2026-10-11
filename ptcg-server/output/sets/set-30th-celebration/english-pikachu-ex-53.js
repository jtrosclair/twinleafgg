"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishPikachuEx53 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed text: https://api.tcgdex.net/v2/en/cards/30th-053
class EnglishPikachuEx53 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.hp = 190;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.regulationMark = 'J';
        this.set = '30C';
        this.setNumber = '53';
        this.usSetNumber = '30C 53';
        this.name = 'Pikachu ex';
        this.fullName = 'Pikachu ex 30C 53';
        this.cardImage = 'assets/cardback.png';
        this.attacks = [{
                name: 'Pika-Pika Parade', cost: [game_1.CardType.COLORLESS], damage: 0,
                text: 'Search your deck for any number of Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            }, {
                name: 'Thunderbolt', cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS], damage: 200,
                text: 'Discard all Energy from this Pokémon.'
            }];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const free = player.bench.filter(b => b.cards.length === 0).length;
            if (free === 0 || player.deck.cards.length === 0) {
                return state;
            }
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: game_1.Stage.BASIC }, { min: 0, max: free, allowCancel: false });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.EnglishPikachuEx53 = EnglishPikachuEx53;
