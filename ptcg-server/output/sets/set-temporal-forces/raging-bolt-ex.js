"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagingBoltex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RagingBoltex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 240;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Burst Roar',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard your hand and draw 6 cards.'
            },
            {
                name: 'Bellowing Thunder',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING],
                damage: 70,
                damageCalculation: 'x',
                text: 'You may discard any amount of Basic Energy from your Pokémon. This attack does 70 damage for each card you discarded in this way.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Raging Bolt ex';
        this.fullName = 'Raging Bolt ex TEF';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveTo(player.discard);
            player.deck.moveTo(player.hand, 6);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = 0;
            // Legacy implementation:
            // - Counted Basic Energy across Active + Bench manually.
            // - Used DiscardEnergyPrompt and moved selected cards by hand.
            // - Set damage to discardedCount * 70.
            //
            // Converted to prefab version (DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON).
            return (0, costs_1.DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON)(store, state, effect, Number.MAX_SAFE_INTEGER, { energyType: card_types_1.EnergyType.BASIC }, 0, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], transfers => {
                effect.damage = transfers.length * 70;
            });
        }
        return state;
    }
}
exports.RagingBoltex = RagingBoltex;
