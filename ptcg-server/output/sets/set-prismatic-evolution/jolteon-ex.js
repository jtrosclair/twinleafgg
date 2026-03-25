"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Jolteonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = L;
        this.hp = 260;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [{
                name: 'Flashing Spear',
                cost: [L, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may discard up to 2 Basic Energy from your Benched Pokémon. This attack does 90 more damage for each card discarded this way.'
            },
            {
                name: 'Dravite',
                cost: [R, W, L],
                damage: 280,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Jolteon ex';
        this.fullName = 'Jolteon ex PRE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage = 60;
            // Legacy implementation:
            // - Checked for any Benched Pokémon before prompting.
            // - Used DiscardEnergyPrompt restricted to BENCH + Basic Energy.
            // - Moved each selected Energy to discard manually.
            // - Set damage to 60 + 90 * discardedCount.
            //
            // Converted to prefab version (DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON).
            return (0, costs_1.DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON)(store, state, effect, 2, { energyType: card_types_1.EnergyType.BASIC }, 0, [game_1.SlotType.BENCH], transfers => {
                effect.damage = 60 + (transfers.length * 90);
            });
        }
        // Carnelian
        // Rampage Thunder
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN)(player);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Jolteonex = Jolteonex;
