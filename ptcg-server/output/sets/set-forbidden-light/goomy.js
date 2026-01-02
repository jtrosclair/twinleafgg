"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goomy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Goomy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 40;
        this.weakness = [{ type: Y }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sticky Membrane',
                text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon\'s attacks cost [C] more.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Ram',
                cost: [Y],
                damage: 10,
                text: ''
            }];
        this.set = 'FLI';
        this.name = 'Goomy';
        this.fullName = 'Goomy FLI 91';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
    }
    reduceEffect(store, state, effect) {
        // Sticky Membrane
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.active.getPokemonCard() === this && !prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                const canApplyAbility = new game_effects_1.EffectOfAbilityEffect(opponent, this.powers[0], this, effect.player.active);
                store.reduceEffect(state, canApplyAbility);
                if (!canApplyAbility.target) {
                    return state;
                }
                effect.cost.push(card_types_1.CardType.COLORLESS);
            }
        }
        return state;
    }
}
exports.Goomy = Goomy;
