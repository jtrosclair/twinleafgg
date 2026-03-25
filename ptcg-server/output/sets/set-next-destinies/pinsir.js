"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinsir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Pinsir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Power Pinch',
                cost: [C, C],
                damage: 0,
                text: 'Flip 2 coins. For each heads, discard an Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Grip and Squeeze',
                cost: [G, G, C],
                damage: 70,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pinsir';
        this.fullName = 'Pinsir NXD';
        this.GRIP_AND_SQUEEZE_MARKER = 'GRIP_AND_SQUEEZE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Power Pinch - flip coins to discard energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                if (heads === 0) {
                    return;
                }
                // Get energy cards from defender
                const energyCards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                if (energyCards.length === 0) {
                    return;
                }
                const cardsToDiscard = Math.min(heads, energyCards.length);
                if (cardsToDiscard > 0) {
                    store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: cardsToDiscard, max: cardsToDiscard, allowCancel: false }), (selected) => {
                        if (selected && selected.length > 0) {
                            const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, selected);
                            discardEffect.target = opponent.active;
                            store.reduceEffect(state, discardEffect);
                        }
                    });
                }
            });
        }
        // Grip and Squeeze - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.GRIP_AND_SQUEEZE_MARKER, opponent.active, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, this.GRIP_AND_SQUEEZE_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, this.GRIP_AND_SQUEEZE_MARKER, this);
        return state;
    }
}
exports.Pinsir = Pinsir;
