"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zebstrika = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Zebstrika extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Blitzle';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Disconnect',
                cost: [L, C],
                damage: 40,
                text: 'Your opponent can\'t play any Item cards from his or her hand during your opponent\'s next turn.'
            },
            {
                name: 'Lightning Crash',
                cost: [L, L, C],
                damage: 0,
                text: 'Discard all [L] Energy attached to this Pokémon. This attack does 80 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zebstrika';
        this.fullName = 'Zebstrika NXD';
        this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Disconnect - block opponent's items
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        // Block item cards
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Lightning Crash - discard all Lightning energy and deal 80 to any Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const lightningEnergy = player.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY &&
                card.energyType === card_types_1.EnergyType.BASIC &&
                card.provides.includes(card_types_1.CardType.LIGHTNING));
            if (lightningEnergy.length > 0) {
                const discardEffect = new attack_effects_2.DiscardCardsEffect(effect, lightningEnergy);
                store.reduceEffect(state, discardEffect);
            }
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(80, effect, store, state);
        }
        // Remove marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        return state;
    }
}
exports.Zebstrika = Zebstrika;
