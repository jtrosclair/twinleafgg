"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turtonator = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const card_types_3 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Turtonator extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 120;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fully Singe',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Discard an Energy from your opponent\'s Active Pokémon ex.'
            },
            {
                name: 'Steaming Stomp',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137'; // Assign correct number if known
        this.name = 'Turtonator';
        this.fullName = 'Turtonator SSP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active;
            const activeCard = opponentActive.getPokemonCard();
            // Only target Pokémon ex
            if (!activeCard || !activeCard.cardTag.includes(card_types_3.CardTag.POKEMON_ex)) {
                return state;
            }
            // Check for any energy attached
            const energyCards = opponentActive.cards.filter(c => c.superType === card_types_2.SuperType.ENERGY);
            if (energyCards.length === 0) {
                return state;
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponentActive, { superType: card_types_2.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, selected);
                    discardEffect.target = opponentActive;
                    store.reduceEffect(state, discardEffect);
                }
                return state;
            });
        }
        return state;
    }
}
exports.Turtonator = Turtonator;
