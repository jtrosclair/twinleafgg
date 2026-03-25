"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullFaceGuard = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FullFaceGuard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Full Face Guard';
        this.fullName = 'Full Face Guard EVS';
        this.text = 'If the Pokémon this card is attached to has no Abilities, it takes 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 20
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tools.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (sourceCard) {
                // Check if source Pokemon has no abilities using CheckPokemonPowersEffect
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(effect.player, sourceCard);
                state = store.reduceEffect(state, powersEffect);
                const hasAbilities = powersEffect.powers.some(power => power.powerType === pokemon_types_1.PowerType.ABILITY);
                if (!hasAbilities) {
                    // Check if damage target is owned by this card's owner 
                    const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
                    if (targetPlayer === player) {
                        effect.reduceDamage(20);
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.FullFaceGuard = FullFaceGuard;
