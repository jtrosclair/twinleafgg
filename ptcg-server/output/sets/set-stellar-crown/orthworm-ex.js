"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orthwormex = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Orthwormex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 220;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Pummeling Payback',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon is damaged by an attack from your opponent\'s Pokémon(even if this Pokémon is Knocked Out), put 2 damage counters on the Attacking Pokémon for each [M] Energy attached to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Rock Tomb',
                cost: [C, C, C, C],
                damage: 150,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Orthworm ex';
        this.fullName = 'Orthworm ex SCR';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if (effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            let isOrthwormexInPlay = false;
            targetPlayer.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isOrthwormexInPlay = true;
                }
            });
            if (!isOrthwormexInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(targetPlayer);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.METAL || cardType === card_types_1.CardType.ANY).length;
            });
            const oppActive = player.active;
            oppActive.damage += energyCount * 10;
        }
        return state;
    }
}
exports.Orthwormex = Orthwormex;
