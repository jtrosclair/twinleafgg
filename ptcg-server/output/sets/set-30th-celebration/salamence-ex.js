"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salamenceex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Salamenceex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Shelgon';
        this.hp = 330;
        this.cardType = game_1.CardType.DRAGON;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Booming Call',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put up to 3 [N] Pokémon from your discard pile onto your Bench.'
            },
            {
                name: 'Dragon Pulse',
                cost: [game_1.CardType.FIRE, game_1.CardType.WATER],
                damage: 240,
                text: 'Discard the top 2 cards of your deck.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Salamence ex';
        this.fullName = 'Salamence ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Booming Call
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const slots = player.bench.filter((b) => b.cards.length === 0);
            if (slots.length === 0) {
                return state;
            }
            const dragonInDiscard = player.discard.cards.filter((c) => c instanceof game_1.PokemonCard && (c.cardType === game_1.CardType.DRAGON || (c.additionalCardTypes || []).includes(game_1.CardType.DRAGON)));
            if (dragonInDiscard.length === 0) {
                return state;
            }
            const max = Math.min(3, slots.length, dragonInDiscard.length);
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (!(c instanceof game_1.PokemonCard) || !(c.cardType === game_1.CardType.DRAGON || (c.additionalCardTypes || []).includes(game_1.CardType.DRAGON))) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: game_1.SuperType.POKEMON, cardType: game_1.CardType.DRAGON }, { min: 0, max, allowCancel: true, blocked }), (selected) => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    if (index < slots.length) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, slots[index], { cards: [card], sourceCard: this });
                        slots[index].pokemonPlayedTurn = state.turn;
                    }
                });
            });
        }
        // Dragon Pulse
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, effect.player, 2, this, effect);
        }
        return state;
    }
}
exports.Salamenceex = Salamenceex;
