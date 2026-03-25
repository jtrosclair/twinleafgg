"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginFormePalkiaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class OriginFormePalkiaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 220;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rule the Region',
                cost: [W],
                damage: 0,
                text: 'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Hydro Break',
                cost: [W, W, C],
                damage: 200,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Origin Forme Palkia V';
        this.fullName = 'Origin Forme Palkia V ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (!(c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.attacks[0]);
        }
        // Hydro Break
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.OriginFormePalkiaV = OriginFormePalkiaV;
