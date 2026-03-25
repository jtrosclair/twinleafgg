"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacredCharm = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class SacredCharm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.name = 'Sacred Charm';
        this.fullName = 'Sacred Charm M2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.text = 'The Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon that have any Abilities.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.tools.includes(this)) {
            const sourcePokemon = effect.source;
            // Check if the source Pokemon has any abilities
            if (sourcePokemon instanceof pokemon_card_1.PokemonCard) {
                const player = game_1.StateUtils.findOwner(state, sourcePokemon);
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, sourcePokemon);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                    effect.damage -= 30;
                    if (effect.damage < 0) {
                        effect.damage = 0;
                    }
                }
            }
        }
        return state;
    }
}
exports.SacredCharm = SacredCharm;
