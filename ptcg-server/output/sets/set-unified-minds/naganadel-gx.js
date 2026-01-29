"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaganadelGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const card_list_1 = require("../../game/store/state/card-list");
class NaganadelGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Poipole';
        this.powers = [{
                name: 'Ultra Conversion',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may discard an Ultra Beast card from your hand. If you do, draw 3 cards.'
            }];
        this.attacks = [
            {
                name: 'Venom Shot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard 2 Energy from this Pokémon. This attack does 170 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Injection-GX',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'Add a card from your opponent\'s discard pile to their Prize cards face down. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.name = 'Naganadel-GX';
        this.fullName = 'Naganadel-GX UNM';
        this.ULTRA_CONVERSION_MARKER = 'ULTRA_CONVERSION_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Remove Ultra Conversion marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ULTRA_CONVERSION_MARKER)) {
            effect.player.marker.removeMarker(this.ULTRA_CONVERSION_MARKER, this);
        }
        // Ultra Conversion ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ULTRA_CONVERSION_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if there's an Ultra Beast in hand
            const hasUltraBeast = player.hand.cards.some(c => {
                return c instanceof pokemon_card_1.PokemonCard && c.tags.includes(card_types_1.CardTag.ULTRA_BEAST);
            });
            if (!hasUltraBeast) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1, blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.ULTRA_CONVERSION_MARKER, this);
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 3);
            });
            return state;
        }
        // Venom Shot attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // First discard 2 energy from this Pokemon
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
            // Then deal 170 damage to 1 opponent's Pokemon
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: false }), (selected) => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 170, targets);
            });
        }
        // Injection-GX attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            if (opponent.discard.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.discard, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const selectedCard = cards[0];
                // Add the selected card to opponent's prizes
                const allPrizeCards = new card_list_1.CardList();
                opponent.prizes.forEach(prizeList => {
                    allPrizeCards.cards.push(...prizeList.cards);
                });
                // Add the card from discard to prizes
                opponent.discard.moveCardsTo([selectedCard], allPrizeCards);
                // Redistribute the prize cards
                const prizeCount = allPrizeCards.cards.length;
                opponent.prizes = [];
                for (let i = 0; i < prizeCount; i++) {
                    const newPrizeList = new card_list_1.CardList();
                    newPrizeList.cards.push(allPrizeCards.cards[i]);
                    newPrizeList.isSecret = true; // Make the new prize face down
                    opponent.prizes.push(newPrizeList);
                }
            });
        }
        return state;
    }
}
exports.NaganadelGX = NaganadelGX;
