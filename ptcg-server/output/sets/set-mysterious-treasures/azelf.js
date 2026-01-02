"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azelf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Azelf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Downer Material',
                text: 'If you have Uxie and Mesprit in play, the attack cost of each of your opponent\'s Basic Pokémon\'s attacks is [C] more. You can\'t use more than 1 Downer Material Poké-Body each turn.',
                powerType: game_1.PowerType.POKEBODY
            }];
        this.attacks = [{
                name: 'Bind Pulse',
                cost: [P],
                damage: 10,
                text: 'During your opponent\'s next turn, your opponent can\'t attach any Special Energy cards from his or her hand to any of his or her Pokémon.'
            }];
        this.set = 'MT';
        this.name = 'Azelf';
        this.fullName = 'Azelf MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.BIND_PULSE_MARKER = 'BIND_PULSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Sticky Membrane
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (!prefabs_1.IS_POKEBODY_BLOCKED(store, state, opponent, this) && ((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                let isAzelfInPlay = false;
                let isMespritInPlay = false;
                let isUxieInPlay = false;
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        isAzelfInPlay = true;
                    }
                    else if (card.name === 'Uxie') {
                        isUxieInPlay = true;
                    }
                    else if (card.name === 'Mesprit') {
                        isMespritInPlay = true;
                    }
                });
                let isTrioInPlay = isMespritInPlay && isUxieInPlay && isAzelfInPlay;
                if (!isTrioInPlay) {
                    return state;
                }
                // Prevent stacking if multiple copies are in play
                const NON_STACK_MARKER = 'DOWNER_MATERIAL_APPLIED';
                if (effect.player.marker.hasMarker(NON_STACK_MARKER, this)) {
                    return state;
                }
                effect.player.marker.addMarker(NON_STACK_MARKER, this);
                effect.cost.push(card_types_1.CardType.COLORLESS);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.BIND_PULSE_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
            const player = effect.player;
            if (player.marker.hasMarker(this.BIND_PULSE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.BIND_PULSE_MARKER, this)) {
                effect.player.marker.removeMarker(this.BIND_PULSE_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.BIND_PULSE_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.Azelf = Azelf;
