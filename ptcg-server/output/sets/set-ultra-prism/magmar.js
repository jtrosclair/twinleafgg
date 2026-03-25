"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Magmar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Controlled Burn',
                cost: [R],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 80,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '18';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magmar';
        this.fullName = 'Magmar UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Controlled Burn
        // Ref: set-breakpoint/durant.ts (Mountain Munch - DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length > 0) {
                (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, opponent, 1, this, effect);
            }
        }
        // Attack 2: Flamethrower
        // Ref: AGENTS-patterns.md (Discard an Energy from this Pokemon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Magmar = Magmar;
