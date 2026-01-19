"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trapinch = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Trapinch extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Smithereen Smash',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Hyper Beam',
                cost: [F, C],
                damage: 20,
                text: ''
            }];
        this.set = 'BCR';
        this.name = 'Trapinch';
        this.fullName = 'Trapinch BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
    }
    reduceEffect(store, state, effect) {
        // Smithereen Smash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        const card = selected[0];
                        opponent.active.moveCardTo(card, opponent.discard);
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Trapinch = Trapinch;
