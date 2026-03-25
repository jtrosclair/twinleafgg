"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trevenant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Trevenant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phantump';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Cursed Roots',
                cost: [P],
                damage: 30,
                text: 'During your opponent\'s next turn, Energy can\'t be attached from your opponent\'s hand to the Defending Pokemon.'
            },
            {
                name: 'Overpain',
                cost: [P, P],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on all your opponent\'s Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Trevenant';
        this.fullName = 'Trevenant M4';
        this.CURSED_ROOTS_MARKER = 'CURSED_ROOTS_MARKER';
        this.CLEAR_CURSED_ROOTS_MARKER = 'CLEAR_CURSED_ROOTS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.CURSED_ROOTS_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_CURSED_ROOTS_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            let totalDamageCounters = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                totalDamageCounters += Math.floor(cardList.damage / 10);
            });
            effect.damage += 10 * totalDamageCounters;
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            if (!effect.player.hand.cards.includes(effect.energyCard)) {
                return state;
            }
            const cardList = effect.target;
            if (!cardList.marker.hasMarker(this.CURSED_ROOTS_MARKER, this)) {
                return state;
            }
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (effect.player !== owner) {
                return state;
            }
            const attackerCardList = game_1.StateUtils.findCardList(state, this);
            const trevenantOwner = game_1.StateUtils.findOwner(state, attackerCardList);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, trevenantOwner, this)) {
                return state;
            }
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_CURSED_ROOTS_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_CURSED_ROOTS_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.CURSED_ROOTS_MARKER, this);
            });
        }
        return state;
    }
}
exports.Trevenant = Trevenant;
