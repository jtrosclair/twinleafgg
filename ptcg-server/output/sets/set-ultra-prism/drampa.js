"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drampa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Drampa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Outrage',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Dragon Pulse',
                cost: [C, C, C],
                damage: 100,
                text: 'Discard the top 2 cards of your deck.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '117';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Drampa';
        this.fullName = 'Drampa UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Outrage
        // Ref: AGENTS-patterns.md (damage for each damage counter)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage += 10 * (player.active.damage / 10);
        }
        // Attack 2: Dragon Pulse
        // Ref: set-breakpoint/durant.ts (Mountain Munch - DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 2, this, effect);
        }
        return state;
    }
}
exports.Drampa = Drampa;
