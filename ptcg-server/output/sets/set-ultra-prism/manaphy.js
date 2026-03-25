"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manaphy = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Manaphy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Deep Currents',
                cost: [W],
                damage: 0,
                text: 'Shuffle 5 [W] Energy cards from your discard pile into your deck.'
            },
            {
                name: 'Water Pulse',
                cost: [W],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Manaphy';
        this.fullName = 'Manaphy UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Deep Currents
        // Ref: AGENTS-patterns.md (energy from discard to deck)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const waterEnergyInDiscard = player.discard.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.WATER)).length;
            if (waterEnergyInDiscard === 0) {
                return state;
            }
            const maxSelect = Math.min(5, waterEnergyInDiscard);
            // Discard is public, so selection is mandatory up to the available amount
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (!(card instanceof game_1.EnergyCard) || card.energyType !== card_types_1.EnergyType.BASIC || !card.provides.includes(card_types_1.CardType.WATER)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: maxSelect, max: maxSelect, allowCancel: false, blocked }), (selected) => {
                const cards = selected || [];
                cards.forEach(card => {
                    player.discard.moveCardTo(card, player.deck);
                });
                return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        // Attack 2: Water Pulse
        // Ref: AGENTS-patterns.md (Asleep)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Manaphy = Manaphy;
