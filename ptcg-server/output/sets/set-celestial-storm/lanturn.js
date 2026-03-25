"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lanturn = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lanturn extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chinchou';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Energy Grounding',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When 1 of your Pokémon is Knocked Out by damage from an opponent\'s attack, you may move a basic Energy card from that Pokémon to this Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Lightning Strike',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: '+',
                text: 'You may discard all [L] Energy from this Pokémon. If you do, this attack does 70 more damage.'
            }
        ];
        this.set = 'CES';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lanturn';
        this.fullName = 'Lanturn CES';
        this.ENERGY_GROUNDING_MARKER = 'ENERGY_GROUNDING_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Energy Grounding Ability
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target !== undefined) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only trigger if Knock Out is from opponent's attack
            if (state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Check if this Lanturn is in play
            let foundLanturn = null;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.cards.length > 0) {
                    foundLanturn = cardList;
                }
            });
            if (!foundLanturn) {
                return state;
            }
            // Check if there is a basic Energy in the knocked out Pokémon
            const basicEnergies = effect.target.cards.filter(c => c.superType === card_types_2.SuperType.ENERGY && c.energyType === card_types_2.EnergyType.BASIC);
            if (basicEnergies.length === 0) {
                return state;
            }
            // Prompt to move 1 basic Energy to this Pokémon
            const basicEnergiesList = new card_list_1.CardList();
            basicEnergiesList.cards = basicEnergies;
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, basicEnergiesList, {}, { min: 0, max: 1, allowCancel: false }), cards => {
                if (!cards || cards.length === 0) {
                    return;
                }
                for (const card of cards) {
                    effect.target.moveCardTo(card, foundLanturn);
                }
            });
            return state;
        }
        // Lightning Strike attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const active = player.active;
            // Find all Lightning Energy attached to this Pokémon
            const lightningEnergies = active.cards.filter(c => c.superType === card_types_2.SuperType.ENERGY && c.provides.includes(card_types_1.CardType.LIGHTNING));
            if (lightningEnergies.length > 0) {
                const lightningEnergiesList = new card_list_1.CardList();
                lightningEnergiesList.cards = lightningEnergies;
                // Prompt to discard all Lightning Energy for extra damage
                state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.WANT_TO_DISCARD_ENERGY, lightningEnergiesList, {}, { min: 0, max: lightningEnergies.length, allowCancel: true }), cards => {
                    if (cards && cards.length === lightningEnergies.length && cards.length > 0) {
                        // Discard all Lightning Energy and do 70 more damage
                        for (const card of cards) {
                            active.moveCardTo(card, player.discard);
                        }
                        effect.damage += 70;
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.Lanturn = Lanturn;
