"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Junk Hunt',
                cost: [D],
                damage: 0,
                text: 'Put 2 Item cards from your discard pile into your hand.'
            }
        ];
        this.set = 'DEX';
        this.name = 'Sableye';
        this.fullName = 'Sableye DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card instanceof game_1.TrainerCard && (card.trainerType !== card_types_1.TrainerType.ITEM)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false, blocked }, this.attacks[0]);
        }
        return state;
    }
}
exports.Sableye = Sableye;
