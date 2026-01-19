"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
class Numel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rollout',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Kindle',
                cost: [R],
                damage: 10,
                text: 'Discard a [R] Energy card attached to Numel and then discard an Energy card attached to the Defending Pokémon.'
            }
        ];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Numel';
        this.fullName = 'Numel DR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIRE);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), selected => {
                const card = selected[0];
                if (!card) {
                    return;
                }
                opponent.active.moveCardTo(card, opponent.discard);
            });
        }
        return state;
    }
}
exports.Numel = Numel;
