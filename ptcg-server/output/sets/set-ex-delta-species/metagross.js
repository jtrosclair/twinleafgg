"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metagross = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
class Metagross extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.additionalCardTypes = [M];
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Delta Control',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may look at the top 4 cards of your deck, choose 1 of them, and put it into your hand. Put the 3 other cards on the bottom of your deck in any order. This power can\'t be used if Metagross is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Crush and Burn',
                cost: [L, M],
                damage: 30,
                damageCalculation: '+',
                text: 'You may discard as many Energy cards as you like attached to your Pokémon in play. If you do, this attack does 30 damage plus 20 more damage for each Energy card you discarded.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Metagross';
        this.fullName = 'Metagross DS';
        this.DELTA_CONTROL_MARKER = 'DELTA_CONTROL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DELTA_CONTROL_MARKER, this);
            return state;
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DELTA_CONTROL_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            const deckBottom = new card_list_1.CardList();
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 4);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: true }), selected => {
                prefabs_1.ADD_MARKER(this.DELTA_CONTROL_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(deckBottom);
                deckBottom.moveTo(player.deck);
                return state;
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DELTA_CONTROL_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const energyCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard).length;
                totalEnergy += energyCount;
            });
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: totalEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return state;
                }
                // Move all selected energies to discard
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    source.moveCardTo(transfer.card, player.discard);
                });
                // Set damage based on number of discarded cards
                effect.damage += transfers.length * 20;
                return state;
            });
        }
        return state;
    }
}
exports.Metagross = Metagross;
