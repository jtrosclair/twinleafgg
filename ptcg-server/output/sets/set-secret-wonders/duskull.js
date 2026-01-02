"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: D, value: +10 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Reaper Cloth',
                powerType: game_1.PowerType.HELD_ITEM,
                text: 'Duskull can evolve during the turn you play it.'
            }];
        this.attacks = [{
                name: 'Astonish',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand without looking. Look at that card you chose, then have your opponent shuffle that card into his or her deck.'
            }];
        this.set = 'SW';
        this.name = 'Duskull';
        this.fullName = 'Duskull SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            if (effect.target.getPokemonCard() !== this) {
                return state;
            }
            player.canEvolve = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                cardList.pokemonPlayedTurn = state.turn - 1;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    if (opponent.hand.cards.length > 0) {
                        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                        const randomCard = opponent.hand.cards[randomIndex];
                        prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
                        prefabs_1.MOVE_CARD_TO(state, randomCard, opponent.deck);
                        prefabs_1.SHUFFLE_DECK(store, state, opponent);
                    }
                }
            });
        }
        return state;
    }
}
exports.Duskull = Duskull;
