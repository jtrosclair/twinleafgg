"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servine2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Servine2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snivy';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Wring Out',
                cost: [G, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. Discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Servine';
        this.fullName = 'Servine BLW 4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Flip for Paralysis
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
            // Discard energy from defender
            const energyCards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            if (energyCards.length > 0) {
                let cards = [];
                store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                    cards = selected || [];
                    if (cards.length > 0) {
                        const discardEnergy = new attack_effects_2.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = opponent.active;
                        store.reduceEffect(state, discardEnergy);
                    }
                });
            }
        }
        return state;
    }
}
exports.Servine2 = Servine2;
