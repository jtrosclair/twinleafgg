"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryPlateGamma = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class MysteryPlateGamma extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TECHNICAL_MACHINE];
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Mystery Plate γ';
        this.fullName = 'Mystery Plate γ SK';
        this.attacks = [{
                name: 'Retro Cave',
                cost: [C],
                damage: 0,
                text: 'If your opponent has 5 or more Prizes, shuffle your hand into your deck and then draw 6 cards. If your opponent has exactly 2 Prizes, choose 1 of your opponent\'s Evolved Pokémon. Your opponent puts the top card on that Evolved Pokémon on the bottom of his or her deck. (This counts as devolving that Pokémon.)'
            }];
        this.text = 'Attach this card to 1 of your Pokémon in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Mystery Plate γ.';
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
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: player.hand.cards });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                (0, prefabs_1.DRAW_CARDS)(player, 6);
            }
            else if (opponent.getPrizeLeft() === 2) {
                let canDevolve = false;
                const blocked = [];
                effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                    if (list.getPokemons().length > 1) {
                        canDevolve = true;
                    }
                    else {
                        blocked.push(target);
                    }
                });
                if (!canDevolve) {
                    return state;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1, blocked }), (results) => {
                    if (results && results.length > 0) {
                        (0, prefabs_1.DEVOLVE_POKEMON)(store, state, results[0], effect.opponent.deck);
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.MysteryPlateGamma = MysteryPlateGamma;
