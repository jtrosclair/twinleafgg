"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Talonflame = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Talonflame extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fletchinder';
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sky Hunt',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may flip a coin. If heads, your opponent discards a random card from their hand.'
            }];
        this.attacks = [{
                name: 'Fire Wing',
                cost: [R, R],
                damage: 110,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.usSetNumber = 'POR 14';
        this.name = 'Talonflame';
        this.fullName = 'Talonflame M3';
        this.SKY_HUNT_MARKER = 'SKY_HUNT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Sky Hunt ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.SKY_HUNT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            player.marker.addMarkerToState(this.SKY_HUNT_MARKER);
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                if (result === true && opponent.hand.cards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                    const randomCard = opponent.hand.cards[randomIndex];
                    opponent.hand.moveCardTo(randomCard, opponent.discard);
                }
            });
            return store.reduceEffect(state, coinFlipEffect);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SKY_HUNT_MARKER, this);
        return state;
    }
}
exports.Talonflame = Talonflame;
