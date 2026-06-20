"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sizzlipede = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Sizzlipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Controlled Burn',
                cost: [R],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.',
            },
            {
                name: 'Bug Panic',
                cost: [C, C, C],
                damage: 0,
                damageCalculation: '+',
                text: 'Reveal the bottom 7 cards of your deck. This attack does 50 damage times the number of Pokémon that have the attack Bug Panic. Then, shuffle those Pokémon back into your deck and discard all other revealed cards.',
            }];
        this.set = 'M5';
        this.setNumber = '8';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sizzlipede';
        this.fullName = 'Sizzlipede M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, effect.player, 1, this, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const revealCount = Math.min(7, player.deck.cards.length);
            const revealed = [];
            for (let i = 0; i < revealCount; i++) {
                const c = player.deck.cards.pop();
                if (c !== undefined) {
                    revealed.push(c);
                }
            }
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, revealed);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, revealed);
            const bugPanicPokemon = revealed.filter(c => c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'Bug Panic'));
            effect.damage += 50 * bugPanicPokemon.length;
            bugPanicPokemon.forEach(c => { player.deck.cards.push(c); });
            revealed.filter(c => !bugPanicPokemon.includes(c)).forEach(c => player.discard.cards.push(c));
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        }
        return state;
    }
}
exports.Sizzlipede = Sizzlipede;
