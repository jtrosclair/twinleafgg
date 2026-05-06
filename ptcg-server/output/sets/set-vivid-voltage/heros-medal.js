"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HerosMedal = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HerosMedal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'D';
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.name = 'Hero\'s Medal';
        this.fullName = 'Hero\'s Medal VIV';
        this.text = 'The Pokémon VMAX this card is attached to gets -100 HP, and if it is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card. You can\'t attach this card to a Pokémon VMAX that has 100 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.tools.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // Only reduce HP for VMAX Pokemon
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.hp -= 100;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tools.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // Only reduce prize count if knocked out by damage from an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            // Only reduce prize count if it's a VMAX Pokemon
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.prizeCount -= 1;
            }
        }
        return state;
    }
}
exports.HerosMedal = HerosMedal;
