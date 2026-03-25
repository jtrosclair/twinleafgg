"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jellicent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class Jellicent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Frillish';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Cursed Body',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), discard an Energy attached to the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Absorb Life',
                cost: [W, W, C],
                damage: 50,
                text: 'Heal 20 damage from this Pokémon.'
            }];
        this.set = 'NVI';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jellicent';
        this.fullName = 'Jellicent NVI';
    }
    reduceEffect(store, state, effect) {
        // Cursed Body - discard energy when damaged
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Only works if this is the active Pokémon and was damaged by opponent
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            // Only during attack phase
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            // Discard energy from attacker
            const attacker = effect.source;
            const attackerEnergy = attacker.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            if (attackerEnergy.length === 0) {
                return state;
            }
            if (attackerEnergy.length === 1) {
                attacker.moveCardTo(attackerEnergy[0], player.discard);
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(targetPlayer, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, attacker, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    attacker.moveCardTo(selected[0], player.discard);
                }
            });
        }
        // Absorb Life - heal 20
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Jellicent = Jellicent;
