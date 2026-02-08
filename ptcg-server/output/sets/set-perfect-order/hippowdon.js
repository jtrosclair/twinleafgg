"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hippowdon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hippowdon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hippopotas';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Tornado Drill',
                cost: [F, F, C],
                damage: 80,
                text: 'If you played Tarragon from your hand during this turn, discard the top 3 cards from your opponent\'s deck.'
            },
            {
                name: 'Heavy Impact',
                cost: [F, F, C, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Hippowdon';
        this.fullName = 'Hippowdon M3';
    }
    reduceEffect(store, state, effect) {
        // Tornado Drill - discard top 3 cards if Tarragon was played
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if Tarragon was played this turn (check if it's in discard and was a supporter)
            const tarragonPlayed = player.discard.cards.some(card => card instanceof game_1.TrainerCard &&
                card.trainerType === game_1.TrainerType.SUPPORTER &&
                card.name === 'Tarragon' &&
                player.supporterTurn === state.turn);
            if (tarragonPlayed && opponent.deck.cards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 3, sourceCard: this, sourceEffect: this.attacks[0] });
            }
        }
        return state;
    }
}
exports.Hippowdon = Hippowdon;
