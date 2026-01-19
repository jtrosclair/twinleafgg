"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroudonEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GroudonEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Rip Claw',
                cost: [F, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
            }, {
                name: 'Massive Rend',
                cost: [F, F, F, C],
                damage: 130,
                text: ''
            },
        ];
        this.set = 'PRC';
        this.name = 'Groudon-EX';
        this.fullName = 'Groudon EX PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
    }
    reduceEffect(store, state, effect) {
        // Rip Claw
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    if (!opponent.active.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                        return state;
                    }
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected;
                        (0, prefabs_1.MOVE_CARDS)(store, state, opponent.active, opponent.discard, { cards: cards });
                    });
                }
            });
        }
        return state;
    }
}
exports.GroudonEx = GroudonEx;
