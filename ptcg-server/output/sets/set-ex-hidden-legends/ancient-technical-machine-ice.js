"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientTechnicalMachineIce = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class AncientTechnicalMachineIce extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TECHNICAL_MACHINE];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Ancient Technical Machine [Ice]';
        this.fullName = 'Ancient Technical Machine [Ice] HL';
        this.attacks = [{
                name: 'Ice Generator',
                cost: [C],
                damage: 0,
                text: 'Discard all of your opponent\'s Trainer cards in play. If you do, prevent all effects, including damage, done to the Pokémon using this attack during your opponent\'s next turn.'
            }];
        this.text = 'Attach this card to 1 of your Evolved Pokémon (excluding Pokémon-ex and Pokémon that has an owner in its name) in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Ancient Technical Machine [Ice].';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            // Find slots to attach TM
            const blocked = [];
            let eligibleCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.getPokemons().length < 2 || card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked.push(index);
                }
                else {
                    eligibleCount++;
                }
            });
            // Error if no slots
            if (eligibleCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked }), transfers => {
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
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex) || cardList.getPokemons().length < 2)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
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
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.PREVENT_DAMAGE)(store, state, effect, this);
            // Discard stadium if it is opponent's
            if (opponent.stadium.cards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.stadium, opponent.discard, { cards: opponent.stadium.cards });
            }
            // Discard all of opponent's Trainer cards in play
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                const topPokemon = cardList.getPokemonCard();
                const pokemonsInStack = cardList.getPokemons();
                const trainerCards = cardList.cards.filter(c => c instanceof trainer_card_1.TrainerCard);
                const tools = cardList.tools.slice();
                // Tools are Trainer cards in play and should always be discarded.
                if (tools.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: tools });
                }
                for (const card of trainerCards) {
                    // Fossil (or similar trainer) currently acting as the Pokemon in play:
                    // discard the whole card list.
                    if (card === topPokemon) {
                        const allCards = cardList.cards.slice();
                        if (allCards.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: allCards });
                        }
                        break;
                    }
                    // Trainer card that appears in the Pokemon stack but is not the top Pokemon
                    // should not be discarded by this attack.
                    if (pokemonsInStack.some(pokemon => pokemon === card)) {
                        continue;
                    }
                    (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: [card] });
                }
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && opponent.active.marker.hasMarker(marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, marker_constants_1.MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        return state;
    }
}
exports.AncientTechnicalMachineIce = AncientTechnicalMachineIce;
