"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ceruledge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const energy_card_1 = require("../../game/store/card/energy-card");
class Ceruledge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Purgatory Slash',
                cost: [R],
                damage: 220,
                text: 'Discard 4 Basic [R] Energy cards from your hand or this attack does nothing.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Ceruledge';
        this.fullName = 'Ceruledge M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check if player has at least 4 Basic Fire Energy cards in hand
            const fireEnergyInHand = player.hand.cards.filter(card => card instanceof energy_card_1.EnergyCard &&
                card.energyType === card_types_1.EnergyType.BASIC &&
                card.name === 'Fire Energy');
            if (fireEnergyInHand.length < 4) {
                // Not enough energy, attack does nothing
                effect.damage = 0;
                return state;
            }
            // Prompt to discard 4 Basic Fire Energy cards
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 4, max: 4, allowCancel: false }), cards => {
                cards = cards || [];
                // Filter to ensure only Fire Energy cards are selected
                const fireEnergyCards = cards.filter(card => card instanceof energy_card_1.EnergyCard &&
                    card.energyType === card_types_1.EnergyType.BASIC &&
                    card.name === 'Fire Energy');
                if (fireEnergyCards.length === 4) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: fireEnergyCards, sourceCard: this });
                }
                else {
                    // If not exactly 4 Fire Energy cards selected, attack does nothing
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Ceruledge = Ceruledge;
