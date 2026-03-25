"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Accelgor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Retribution',
                cost: [C],
                damage: 20,
                text: 'If an Escavalier you had in play was Knocked Out by damage from an opponent\'s attack during his or her last turn, put all Energy attached to the Defending Pok\u00e9mon into your opponent\'s hand.'
            },
            {
                name: 'Signal Beam',
                cost: [G, C],
                damage: 30,
                text: 'The Defending Pok\u00e9mon is now Confused.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor PLB';
        this.ESCAVALIER_KO_MARKER = 'ESCAVALIER_KO_MARKER';
        this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER = 'ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Track Escavalier damaged by opponent's attack this turn.
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.damage > 0) {
            const damagedCard = effect.target.getPokemonCard();
            if ((damagedCard === null || damagedCard === void 0 ? void 0 : damagedCard.name) === 'Escavalier') {
                const owner = state_utils_1.StateUtils.findOwner(state, effect.target);
                if (owner !== effect.player) {
                    effect.target.marker.addMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this);
                }
            }
        }
        // Track when your Escavalier is KO'd by damage from opponent's attack.
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const knockedOutCard = effect.target.getPokemonCard();
            if ((knockedOutCard === null || knockedOutCard === void 0 ? void 0 : knockedOutCard.name) === 'Escavalier'
                && effect.target.marker.hasMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this)) {
                const owner = state_utils_1.StateUtils.findOwner(state, effect.target);
                owner.marker.addMarker(this.ESCAVALIER_KO_MARKER, this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.ESCAVALIER_KO_MARKER, this)) {
                // Put all energy from defending Pokemon into opponent's hand
                const energyCards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                energyCards.forEach(card => {
                    opponent.active.moveCardTo(card, opponent.hand);
                });
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Marker cleanup
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.ESCAVALIER_KO_MARKER, this);
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this);
                });
            });
        }
        return state;
    }
}
exports.Accelgor = Accelgor;
