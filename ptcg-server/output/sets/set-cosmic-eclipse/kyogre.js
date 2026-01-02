"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyogre = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kyogre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'High Water',
                cost: [C],
                damage: 130,
                text: 'Attach 2 [W] Energy cards from your discard pile to 1 of your Pokémon.'
            },
            {
                name: 'Swirling Waves',
                cost: [W, W, C, C],
                damage: 130,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Kyogre';
        this.fullName = 'Kyogre CEC';
    }
    reduceEffect(store, state, effect) {
        // High Water ability
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // Count Water Energy cards in discard
            const waterEnergyCards = player.discard.cards.filter(c => {
                return c instanceof energy_card_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.WATER);
            });
            // If there are 0 Water Energy, return state without prompting
            if (waterEnergyCards.length === 0) {
                return state;
            }
            // Determine how many energy cards to attach based on availability
            const minToAttach = waterEnergyCards.length === 1 ? 1 : 2;
            const maxToAttach = waterEnergyCards.length === 1 ? 1 : 2;
            // Prompt to attach Water Energy from discard to 1 of player's Pokemon
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: minToAttach, max: maxToAttach, allowCancel: false }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                // Filter to only Water Energy cards
                const validTransfers = transfers.filter(transfer => {
                    const card = transfer.card;
                    return card instanceof energy_card_1.EnergyCard
                        && card.energyType === card_types_1.EnergyType.BASIC
                        && card.provides.includes(card_types_1.CardType.WATER);
                });
                if (validTransfers.length < minToAttach) {
                    throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                }
                // Attach energy cards to target Pokemon
                for (const transfer of validTransfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    prefabs_1.MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
                }
            });
        }
        // Swirling Waves attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            // Prompt to discard 1 energy from this Pokemon
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return;
                }
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                return store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Kyogre = Kyogre;
