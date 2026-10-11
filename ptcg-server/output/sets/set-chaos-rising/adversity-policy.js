"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdversityPolicy = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AdversityPolicy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'CRI';
        this.usSetNumber = 'CRI 74';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Adversity Policy';
        this.fullName = 'Adversity Policy CRI';
        this.text = "If the Pokémon this card is attached to has Weakness to your opponent's Active Pokémon's type, is in the Active Spot, and is damaged by an attack from your opponent's Pokémon (even if this Pokémon is Knocked Out), draw 3 cards.";
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            const attachedPokemon = effect.target.getPokemonCard();
            if (attachedPokemon === undefined) {
                return state;
            }
            const checkOpponentType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkOpponentType);
            const opponentTypes = checkOpponentType.cardTypes;
            const hasWeaknessToOpponentActiveType = attachedPokemon.weakness.some((w) => opponentTypes.includes(w.type));
            if (!hasWeaknessToOpponentActiveType) {
                return state;
            }
            (0, prefabs_1.MOVE_CARDS)(store, state, targetPlayer.deck, targetPlayer.hand, { count: 3, sourceCard: this });
        }
        return state;
    }
}
exports.AdversityPolicy = AdversityPolicy;
