"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharizardStar = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CharizardStar extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.STAR, game_1.CardTag.DELTA_SPECIES];
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Rotating Claws',
                cost: [D, C],
                damage: 20,
                text: 'You may discard an Energy card attached to Charizard Star. If you do, search your discard pile for an Energy card (excluding the one you discarded) and attach it to Charizard Star.'
            },
            {
                name: 'Dark Swirl',
                cost: [D, D, D, D, C],
                damage: 150,
                text: 'Discard all Energy cards attached to Charizard Star and discard the top 3 cards from your opponent\'s deck.'
            }];
        this.set = 'DF';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Charizard Star';
        this.fullName = 'Charizard Star DF';
    }
    reduceEffect(store, state, effect) {
        // Rotating Claws
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
                    if (player.discard.cards.some(card => card.superType === game_1.SuperType.ENERGY)) {
                        state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                            transfers = transfers || [];
                            // cancelled by user
                            if (transfers.length === 0) {
                                return;
                            }
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                            }
                        });
                    }
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 3, sourceCard: this, sourceEffect: this.attacks[1] });
        }
        return state;
    }
}
exports.CharizardStar = CharizardStar;
