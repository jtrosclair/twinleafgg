"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manaphy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Manaphy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wave Veil',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokémon by ' +
                    'attacks from your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Manaphy';
        this.fullName = 'Manaphy BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            /*
             * Legacy pre-prefab implementation:
             * - inferred defending/attacking owners from source/target
             * - checked bench-only targeting and opponent-only source
             * - scanned defending board for this Manaphy instance
             * - manually stubbed PowerEffect to respect ability lock
             * - set effect.preventDefault = true
             */
            // Converted to prefab version (PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS).
            state.players.forEach(owner => {
                (0, prefabs_1.PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS)(store, state, effect, {
                    owner,
                    source: this,
                    includeSourcePokemon: true
                });
            });
        }
        return state;
    }
}
exports.Manaphy = Manaphy;
