"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReversalTrigger = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ReversalTrigger extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.set = 'PLB';
        this.setNumber = '86';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Reversal Trigger';
        this.fullName = 'Reversal Trigger PLB';
        this.text = 'When the Team Plasma Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, search your deck for a card and put it into your hand. Shuffle your deck afterward.';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        // Reset damage flag at the start of each attack
        if (effect instanceof game_effects_1.AttackEffect) {
            this.damageDealt = false;
        }
        // Track if damage was dealt to the attached Pokemon
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.tools.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Only works on Team Plasma Pokemon
            const pokemon = effect.target.getPokemonCard();
            if (pokemon && pokemon.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                this.damageDealt = true;
            }
        }
        // When KO'd by damage from attack, search deck for any card
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tools.includes(this)
            && this.damageDealt) {
            const toolOwner = game_1.StateUtils.findOwner(state, effect.target);
            // Only works on Team Plasma Pokemon
            const pokemon = effect.target.getPokemonCard();
            if (pokemon && pokemon.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                this.damageDealt = false;
                if (toolOwner.deck.cards.length > 0) {
                    (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, toolOwner, this, {}, { min: 1, max: 1, allowCancel: false });
                }
            }
        }
        return state;
    }
}
exports.ReversalTrigger = ReversalTrigger;
