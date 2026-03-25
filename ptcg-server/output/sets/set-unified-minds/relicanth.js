"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relicanth = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Relicanth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Deep Sea Boring',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Trainer card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Water Pulse',
                cost: [C, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '111';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Relicanth';
        this.fullName = 'Relicanth UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Deep Sea Boring
        // Ref: set-unbroken-bonds/darmanitan.ts (Find Wildfire - search deck for cards)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: true });
        }
        // Attack 2: Water Pulse
        // Ref: AGENTS-patterns.md (Asleep status)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Relicanth = Relicanth;
