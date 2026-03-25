"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arcanine2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Arcanine2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Growlithe';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Blazing Mane',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.'
            }];
        this.attacks = [{
                name: 'Fire Spin',
                cost: [R, R, C],
                damage: 100,
                text: 'Flip a coin. If tails, discard 2 Energy attached to this Pokémon.'
            }];
        this.set = 'NXD';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Arcanine';
        this.fullName = 'Arcanine NXD 12';
    }
    reduceEffect(store, state, effect) {
        // Blazing Mane - burn attacker when hit
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            // Only works if this is the active Pokémon and was damaged by opponent
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            // Only during attack phase
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Burn the attacking Pokémon
            player.active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
        }
        // Fire Spin - flip, if tails discard 2 energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
                }
            });
        }
        return state;
    }
}
exports.Arcanine2 = Arcanine2;
