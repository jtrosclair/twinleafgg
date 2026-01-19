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
const energy_card_1 = require("../../game/store/card/energy-card");
const card_list_1 = require("../../game/store/state/card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lanturn extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chinchou';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Energy Grounding',
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your opponent\'s turn, when any of your Pokémon is Knocked Out by your opponent\'s attacks, you may use this power. Choose a basic Energy card discarded from the Knocked Out Pokémon and attach it to Lanturn. You can\'t use more than 1 Energy Grounding Poké-Power each turn.'
            }];
        this.attacks = [{
                name: 'Lightning Strike',
                cost: [L, L, C],
                damage: 50,
                text: 'You may discard all [L] Energy attached to Lanturn. If you do, this attack\'s base damage is 90 instead of 50.'
            }];
        this.set = 'HL';
        this.setNumber = '38';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lanturn';
        this.fullName = 'Lanturn HL';
        this.ENERGY_GROUNDING_MARKER = 'ENERGY_GROUNDING_MARKER';
        this.usedLightningStrike = false;
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
            const basicEnergies = effect.target.cards.filter(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_2.EnergyType.BASIC);
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
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
                    effect.damage = 90;
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        return state;
    }
}
exports.Lanturn = Lanturn;
