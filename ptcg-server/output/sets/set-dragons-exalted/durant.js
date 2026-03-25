"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Durant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Durant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pull Out',
                cost: [C],
                damage: 0,
                text: 'Put a card from your discard pile on top of your deck.'
            },
            {
                name: 'Iron Head',
                cost: [M, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Durant';
        this.fullName = 'Durant DRX';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Pull Out - put a card from discard on top of deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_DISCARD_EMPTY)(player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 1, allowCancel: false }), (selected) => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.deck);
                    // Put on top of deck - moveCardsTo already puts on top
                }
            });
        }
        // Attack 2: Iron Head - flip until tails, 30x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, attack_effects_1.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Durant = Durant;
