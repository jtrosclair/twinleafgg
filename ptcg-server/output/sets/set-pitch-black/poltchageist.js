"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poltchageist = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const ghost_veil_1 = require("./ghost-veil");
class Poltchageist extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 30;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.powers = [{
                name: 'Ghost Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
            }];
        this.attacks = [{
                name: 'Furtive Drop',
                cost: [C],
                damage: 0,
                text: 'Place 1 damage counter on your opponent\'s Active Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '5';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Poltchageist';
        this.fullName = 'Poltchageist M5';
    }
    reduceEffect(store, state, effect) {
        (0, ghost_veil_1.reduceGhostVeil)(store, state, effect, this);
        // Ref: set-surging-sparks/uxie.ts (Return Portal — PutCountersEffect damage counter placement)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const putCounters = new attack_effects_1.PutCountersEffect(effect, 10);
            return store.reduceEffect(state, putCounters);
        }
        return state;
    }
}
exports.Poltchageist = Poltchageist;
