"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroicBomb = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HeroicBomb extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'M5';
        this.setNumber = '73';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heroic Bomb';
        this.fullName = 'Heroic Bomb M5';
        this.text = `If the Pokémon this card is attached to is not a Mega Pokémon ex and takes 240 or more damage from your opponent's Active Mega Pokémon ex, place 12 damage counters on the Attacking Pokémon. Then, discard this card.`;
    }
    reduceEffect(store, state, effect) {
        if (!(effect instanceof attack_effects_1.DealDamageEffect)) {
            return state;
        }
        if (state.phase !== state_1.GamePhase.ATTACK) {
            return state;
        }
        if (effect.damage < 240) {
            return state;
        }
        const defenderOwner = state_utils_1.StateUtils.findOwner(state, effect.target);
        if (effect.player === defenderOwner) {
            return state;
        }
        const heroicOnDefender = effect.target.tools.find((t) => t instanceof HeroicBomb);
        if (heroicOnDefender === undefined) {
            return state;
        }
        if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, defenderOwner, heroicOnDefender)) {
            return state;
        }
        const defenderCard = effect.target.getPokemonCard();
        if (defenderCard === undefined) {
            return state;
        }
        const defenderIsMegaEx = defenderCard.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA)
            && defenderCard.tags.includes(card_types_1.CardTag.POKEMON_ex);
        if (defenderIsMegaEx) {
            return state;
        }
        const attackerCard = effect.player.active.getPokemonCard();
        const attackerIsMegaEx = (attackerCard === null || attackerCard === void 0 ? void 0 : attackerCard.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA))
            && (attackerCard === null || attackerCard === void 0 ? void 0 : attackerCard.tags.includes(card_types_1.CardTag.POKEMON_ex));
        if (!attackerIsMegaEx || effect.source !== effect.player.active) {
            return state;
        }
        const put = new game_effects_1.PlaceDamageCountersEffect(defenderOwner, effect.player.active, 120);
        store.reduceEffect(state, put);
        effect.target.moveCardTo(heroicOnDefender, defenderOwner.discard);
        return state;
    }
}
exports.HeroicBomb = HeroicBomb;
