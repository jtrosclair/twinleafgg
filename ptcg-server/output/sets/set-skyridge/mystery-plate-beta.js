"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryPlateBeta = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class MysteryPlateBeta extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TECHNICAL_MACHINE];
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.name = 'Mystery Plate β';
        this.fullName = 'Mystery Plate β SK';
        this.attacks = [{
                name: 'Stone Crush',
                cost: [C],
                damage: 0,
                text: 'If your opponent has 5 or more Prizes, draw 3 cards. If your opponent has only 1 Prize, choose 2 Energy cards attached to the Defending Pokémon (1 if there is only 1). Your opponent shuffles those cards into his or her deck.'
            }];
        this.text = 'Attach this card to 1 of your Pokémon in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Mystery Plate β.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), transfers => {
                player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const reduction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < reduction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && effect.player.active.cards.includes(this) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (opponent.getPrizeLeft() >= 5) {
                (0, prefabs_1.DRAW_CARDS)(player, 3);
            }
            else if (opponent.getPrizeLeft() === 1) {
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 2, allowCancel: false }), selected => {
                    const card = selected[0];
                    if (!card) {
                        return;
                    }
                    opponent.active.moveCardTo(card, opponent.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                });
            }
        }
        return state;
    }
}
exports.MysteryPlateBeta = MysteryPlateBeta;
