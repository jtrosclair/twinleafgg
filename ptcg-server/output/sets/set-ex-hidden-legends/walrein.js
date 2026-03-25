"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Walrein = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Walrein extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Sealeo';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Crush Draw',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may reveal the top card of your deck. If that card is a basic Energy card, attach it to 1 of your Pokémon. If not, put the card back on your deck. This power can\'t be used if Walrein is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Sheer Cold',
                cost: [W, W, C],
                damage: 50,
                text: 'Flip a coin. If heads, each Defending Pokémon can\'t attack during your opponent\'s next turn.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Walrein';
        this.fullName = 'Walrein HL';
        this.CRUSH_DRAW_MARKER = 'CRUSH_DRAW_MARKER';
        this.SHEER_COLD_MARKER = 'SHEER_COLD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.CRUSH_DRAW_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.CRUSH_DRAW_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.CRUSH_DRAW_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            player.deck.moveTo(temp, 1);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC;
            });
            // If no energy cards were drawn, move all cards to discard
            if (energyCardsDrawn.length == 0) {
                player.marker.addMarker(this.CRUSH_DRAW_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                temp.cards.slice(0, 1).forEach(card => {
                    store.prompt(state, [new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, temp.cards)], () => {
                        temp.moveToTopOfDestination(player.deck);
                    });
                });
            }
            else {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: energyCardsDrawn.length, allowCancel: false }), transfers => {
                    player.marker.addMarker(this.CRUSH_DRAW_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.hand); // Move card to hand
                        });
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_MARKER)(this.SHEER_COLD_MARKER, opponent.active, this);
                }
            });
        }
        if (effect instanceof game_effects_1.UseAttackEffect && (0, prefabs_1.HAS_MARKER)(this.SHEER_COLD_MARKER, effect.player.active, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            (0, prefabs_1.REMOVE_MARKER)(this.SHEER_COLD_MARKER, effect.player.active, this);
        }
        return state;
    }
}
exports.Walrein = Walrein;
