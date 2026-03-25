"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Overeager',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'If Sableye is your Active Pokemon at the beginning of the game, ' +
                    'you go first. (If each player\'s Active Pokemon has the Overreager ' +
                    'Poke-Body, this power does nothing.)'
            }];
        this.attacks = [{
                name: 'Impersonate',
                cost: [],
                damage: 0,
                text: 'Search your deck for a Supporter card and discard it. ' +
                    'Shuffle your deck afterward. ' +
                    'Then, use the effect of that card as the effect of this attack.'
            },
            {
                name: 'Overconfident',
                cost: [D],
                damage: 10,
                text: 'If the Defending Pokemon has fewer remaining HP than Sableye, ' +
                    'this attack\'s base damage is 40.'
            }];
        this.set = 'SF';
        this.name = 'Sableye';
        this.fullName = 'Sableye SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
    }
    reduceEffect(store, state, effect) {
        // Overeager
        if (effect instanceof game_phase_effects_1.WhoBeginsEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentCard = opponent.active.getPokemonCard();
            if (opponentCard && opponentCard.powers.some(p => p.name === 'Overeager')) {
                return state;
            }
            if (cardList === player.active) {
                store.log(state, game_message_1.GameLog.LOG_STARTS_BECAUSE_OF_ABILITY, {
                    name: player.name,
                    ability: this.powers[0].name
                });
                effect.player = player;
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const itemCount = player.discard.cards.filter(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
            }).length;
            if (itemCount === 0) {
                return state;
            }
            const max = Math.min(1, itemCount);
            const min = max;
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Sableye = Sableye;
