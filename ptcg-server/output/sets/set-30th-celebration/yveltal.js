"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 120;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Life-Locked',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent\'s Active Pokémon can\'t be healed.'
            }];
        this.attacks = [{
                name: 'Dark Cutter',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal 30C';
    }
    reduceEffect(store, state, effect) {
        // Life-Locked
        if (effect instanceof game_effects_1.HealEffect) {
            for (const player of state.players) {
                if (!game_1.StateUtils.isPokemonInPlay(player, this)) {
                    continue;
                }
                if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    return state;
                }
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (effect.target === opponent.active) {
                    effect.preventDefault = true;
                    return state;
                }
            }
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
