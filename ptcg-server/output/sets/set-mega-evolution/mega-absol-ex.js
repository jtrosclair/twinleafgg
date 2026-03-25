"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaAbsolex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaAbsolex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 280;
        this.cardType = D;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Terminal Period',
                cost: [D, C],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon has exactly 6 damage counters on it, that Pokémon is Knocked Out.'
            },
            {
                name: 'Claw of Darkness',
                cost: [D, D, C],
                damage: 200,
                text: 'Your opponent reveals their hand, and you discard a card you find there.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Mega Absol ex';
        this.fullName = 'Mega Absol ex M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage === 60) {
                opponent.active.damage += 999;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length == 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1 }), selectedCard => {
                const selected = selectedCard || [];
                if (selectedCard === null || selected.length === 0) {
                    return;
                }
                opponent.hand.moveCardTo(selected[0], opponent.discard);
            });
        }
        return state;
    }
}
exports.MegaAbsolex = MegaAbsolex;
