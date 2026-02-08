"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKoko = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TapuKoko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fast Flight',
                cost: [L],
                damage: 0,
                canUseOnFirstTurn: true,
                text: 'If you go first, you can use this attack during your first turn. Discard your hand and draw 5 cards.'
            },
            {
                name: 'Thunder Blast',
                cost: [L, L, C],
                damage: 130,
                text: 'Discard 2 Energy from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Tapu Koko';
        this.fullName = 'Tapu Koko M2a';
    }
    reduceEffect(store, state, effect) {
        // Fast Flight
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Discard all cards from hand
            const cards = player.hand.cards;
            player.hand.moveCardsTo(cards, player.discard);
            // Draw 5 cards
            if (player.deck.cards.length > 0) {
                player.deck.moveTo(player.hand, 5);
            }
        }
        // Thunder Blast
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check if this Pokémon has at least 2 energy attached
            const energyCount = player.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY).length;
            if (energyCount >= 2) {
                state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2 }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        source.moveCardTo(transfer.card, player.discard);
                    }
                });
            }
        }
        return state;
    }
}
exports.TapuKoko = TapuKoko;
