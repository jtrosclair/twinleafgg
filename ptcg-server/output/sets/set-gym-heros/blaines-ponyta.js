"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlainesPonyta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class BlainesPonyta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BLAINES];
        this.cardType = R;
        this.hp = 40;
        this.weakness = [{ type: W }];
        this.retreat = [];
        this.attacks = [{
                name: 'Agility',
                cost: [R, C],
                damage: 20,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Blaine\'s Ponyta.'
            }];
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Blaine\'s Ponyta';
        this.fullName = 'Blaine\'s Ponyta G1';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.AGILITY_MARKER, this);
                    (0, prefabs_1.ADD_MARKER)(this.AGILITY_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.AGILITY_MARKER, effect.player, this)) {
            (0, prefabs_1.REMOVE_MARKER)(this.AGILITY_MARKER, effect.player, this);
            this.marker.removeMarker(this.AGILITY_MARKER, this);
        }
        return state;
    }
}
exports.BlainesPonyta = BlainesPonyta;
