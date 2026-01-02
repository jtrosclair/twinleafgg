"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Illumise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Illumise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slowing Perfume ',
                cost: [C],
                damage: 0,
                text: 'You can use this attack only if you go second, and only during your first turn. Shuffle 1 of your opponent\'s Benched Pokémon and all attached cards into their deck.'
            },
            {
                name: 'Glide',
                cost: [G, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Illumise';
        this.fullName = 'Illumise TWM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (state.turn != 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            else {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.active.moveTo(opponent.deck);
                opponent.active.clearEffects();
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            }
        }
        return state;
    }
}
exports.Illumise = Illumise;
