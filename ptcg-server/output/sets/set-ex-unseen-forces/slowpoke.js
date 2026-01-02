"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowpoke extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Fishing Tail',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for a Basic Pokémon, Evolution card, or basic Energy card, show it to your opponent, and put it into your hand.'
            },
            {
                name: 'Trip Over',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
            }
        ];
        this.set = 'UF';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
    }
    reduceEffect(store, state, effect) {
        // Fishing Tail
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let pokemons = 0;
            let energies = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
                    energies += 1;
                }
                else if (c instanceof game_1.PokemonCard) {
                    pokemons += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Player does not have correct cards in discard
            if (pokemons === 0 && energies === 0) {
                return state;
            }
            const maxPokemons = Math.min(pokemons, 1);
            const maxEnergies = Math.min(energies, 1);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: 1, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                    prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards });
                }
            });
            return state;
        }
        // Trip Over
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            // Flip a coin
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                if (result) {
                    effect.damage += 10; // 20 base + 10 for heads
                }
                return state;
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
