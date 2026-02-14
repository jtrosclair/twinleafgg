"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sylveon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sylveon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Eevee';
        this.attacks = [
            {
                name: 'Wink Wink',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand. You may discard a Supporter card you find there and use the effect of that card as the effect of this attack.'
            },
            {
                name: 'Magical Shot',
                cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'FLI';
        this.name = 'Sylveon';
        this.fullName = 'Sylveon FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
    }
    reduceEffect(store, state, effect) {
        // Wink Wink
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, opponent.hand, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 0, max: 1 }), cards => {
                if (cards === null || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                opponent.hand.moveCardsTo(cards, opponent.discard);
                // Save and reset supporterTurn so the effect resolves
                // even if a supporter was already played this turn
                const savedSupporterTurn = player.supporterTurn;
                player.supporterTurn = 0;
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
                // Restore supporterTurn
                player.supporterTurn = savedSupporterTurn;
            });
        }
        return state;
    }
}
exports.Sylveon = Sylveon;
