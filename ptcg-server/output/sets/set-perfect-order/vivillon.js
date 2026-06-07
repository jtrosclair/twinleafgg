"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vivillon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vivillon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Spewpa';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Big Wings',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may have your opponent shuffle their hand and put all of those cards on the bottom of their deck. Then, your opponent draws 4 cards.'
            }];
        this.attacks = [{
                name: 'Blow Through',
                cost: [G],
                damage: 60,
                text: 'If there is a Stadium in play, this attack does 60 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.usSetNumber = 'POR 9';
        this.name = 'Vivillon';
        this.fullName = 'Vivillon M3';
        this.BIG_WINGS_MARKER = 'BIG_WINGS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.BIG_WINGS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Shuffle the opponent's hand
            this.shufflePlayerHand(opponent);
            const deckBottom = new game_1.CardList();
            opponent.hand.moveTo(deckBottom);
            deckBottom.moveTo(opponent.deck);
            opponent.deck.moveTo(opponent.hand, 4);
            (0, prefabs_1.ABILITY_USED)(player, this);
            player.marker.addMarker(this.BIG_WINGS_MARKER, this);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 60;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BIG_WINGS_MARKER, this)) {
            effect.player.marker.removeMarker(this.BIG_WINGS_MARKER, this);
        }
        return state;
    }
    shufflePlayerHand(player) {
        const hand = player.hand.cards;
        // Shuffle the hand using the Fisher-Yates shuffle algorithm
        for (let i = hand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hand[i], hand[j]] = [hand[j], hand[i]];
        }
    }
}
exports.Vivillon = Vivillon;
