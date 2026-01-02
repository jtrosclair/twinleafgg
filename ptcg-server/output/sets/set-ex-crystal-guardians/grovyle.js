"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grovyle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Grovyle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Treecko';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Agility',
                cost: [P, C, C],
                damage: 30,
                text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Grovyle during your opponent\'s next turn.'
            }
        ];
        this.set = 'CG';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Grovyle';
        this.fullName = 'Grovyle CG';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.AGILITY_MARKER, this);
                    prefabs_1.ADD_MARKER(this.AGILITY_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.AGILITY_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.AGILITY_MARKER, effect.player, this);
            this.marker.removeMarker(this.AGILITY_MARKER, this);
        }
        return state;
    }
}
exports.Grovyle = Grovyle;
