"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Charge Up',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for an Energy card and attach it to Eevee. Shuffle your deck afterward.'
            },
            {
                name: 'Lunge',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'AQ';
        this.name = 'Eevee';
        this.fullName = 'Eevee AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    const player = effect.player;
                    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                        transfers = transfers || [];
                        // Attach energy if selected
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            (0, prefabs_1.MOVE_CARDS)(store, state, game_1.StateUtils.findCardList(state, transfer.card), target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;
