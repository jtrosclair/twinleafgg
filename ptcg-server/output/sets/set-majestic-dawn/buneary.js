"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buneary = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Buneary extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Drawup Power',
                cost: [],
                damage: 0,
                text: 'Search your deck for an Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Extend Ears',
                cost: [C],
                damage: 10,
                text: 'Remove 1 damage counter from each of your Benched Pokémon.'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Buneary';
        this.fullName = 'Buneary MD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList !== effect.player.active) {
                    const healEffect = new game_effects_1.HealEffect(effect.player, cardList, 1);
                    state = store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Buneary = Buneary;
