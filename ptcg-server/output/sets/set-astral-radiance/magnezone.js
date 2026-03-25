"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnezone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnezone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Magneton';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Giga Magnet',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top 6 cards of your deck and attach any number of [M] Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
            }];
        this.attacks = [{
                name: 'Power Beam',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Magnezone';
        this.fullName = 'Magnezone ASR';
        this.GIGA_MAGNET_MARKER = 'GIGA_MAGNET_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.GIGA_MAGNET_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.GIGA_MAGNET_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.marker.hasMarker(this.GIGA_MAGNET_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length == 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Look at top 6 cards
            player.deck.moveTo(temp, 6);
            // Filter for Metal Energy cards
            const metalEnergyCards = temp.cards.filter(card => card instanceof game_1.EnergyCard &&
                card.name === 'Metal Energy');
            if (metalEnergyCards.length === 0) {
                // If no Metal Energy found, return all cards to deck and shuffle
                // Show the cards to the player first
                return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS, temp.cards), () => {
                    temp.moveTo(player.deck);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
            // Prompt to attach Metal Energy cards
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Metal Energy' }, { min: 0, max: metalEnergyCards.length }), transfers => {
                if (transfers) {
                    // Attach selected energy cards
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        temp.moveCardTo(transfer.card, target);
                    }
                }
                player.marker.addMarker(this.GIGA_MAGNET_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                // Return remaining cards to deck and shuffle
                temp.moveTo(player.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Magnezone = Magnezone;
