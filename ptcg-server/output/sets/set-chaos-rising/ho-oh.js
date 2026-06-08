"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoOh = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class HoOh extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Flames of Resurrection',
                cost: [R],
                damage: 0,
                text: 'Put up to 3 Basic Pokemon from your discard pile onto your Bench.'
            },
            {
                name: 'Bright Wing',
                cost: [R, R, R],
                damage: 130,
                text: 'Discard an Energy attached to this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.usSetNumber = 'CRI 10';
        this.name = 'Ho-Oh';
        this.fullName = 'Ho-Oh M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                return state;
            }
            const basicInDiscard = player.discard.cards.filter(c => c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC);
            if (basicInDiscard.length === 0) {
                return state;
            }
            const max = Math.min(3, slots.length, basicInDiscard.length);
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (!(c instanceof game_1.PokemonCard) || c.stage !== card_types_1.Stage.BASIC) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: true, blocked }), selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    if (index < slots.length) {
                        player.discard.moveCardTo(card, slots[index]);
                        slots[index].pokemonPlayedTurn = state.turn;
                    }
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.HoOh = HoOh;
