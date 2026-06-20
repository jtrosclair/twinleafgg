"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morpekoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Morpekoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 180;
        this.cardType = D;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Wheel Draw',
                cost: [D],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 6 cards.',
            },
            {
                name: 'Hunger Bomber',
                cost: [D, D],
                damage: 40,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each damage counter on this Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '53';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Morpeko ex';
        this.fullName = 'Morpeko ex M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const copied = [...player.hand.cards];
            copied.forEach(c => player.hand.moveCardTo(c, player.deck));
            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                (0, prefabs_1.DRAW_CARDS)(player, 6);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const counters = Math.floor(effect.source.damage / 10);
            effect.damage += 40 * counters;
        }
        return state;
    }
}
exports.Morpekoex = Morpekoex;
