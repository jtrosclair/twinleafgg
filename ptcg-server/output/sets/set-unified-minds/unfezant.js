"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unfezant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Unfezant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tranquill';
        this.cardType = C;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Gust',
                cost: [C],
                damage: 40,
                text: ''
            },
            {
                name: 'Downburst',
                cost: [C, C, C],
                damage: 90,
                text: 'You may have each player shuffle all cards attached to their Active Pokémon into their deck.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '176';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Unfezant';
        this.fullName = 'Unfezant UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Downburst
        // Ref: set-unbroken-bonds/vikavolt.ts (Electricannon - optional ConfirmPrompt pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToShuffle => {
                if (wantToShuffle) {
                    // Shuffle player's active attached cards into deck
                    const playerPokemons = player.active.getPokemons();
                    const playerAttached = player.active.cards.filter(c => !playerPokemons.includes(c));
                    playerAttached.forEach(c => {
                        player.active.moveCardTo(c, player.deck);
                    });
                    // Also handle tools
                    const playerTools = player.active.tools.slice();
                    playerTools.forEach(c => {
                        player.active.moveCardTo(c, player.deck);
                    });
                    // Shuffle opponent's active attached cards into deck
                    const oppPokemons = opponent.active.getPokemons();
                    const oppAttached = opponent.active.cards.filter(c => !oppPokemons.includes(c));
                    oppAttached.forEach(c => {
                        opponent.active.moveCardTo(c, opponent.deck);
                    });
                    const oppTools = opponent.active.tools.slice();
                    oppTools.forEach(c => {
                        opponent.active.moveCardTo(c, opponent.deck);
                    });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                }
            });
        }
        return state;
    }
}
exports.Unfezant = Unfezant;
