"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stonjourner = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Stonjourner extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Land\'s Pulse',
                cost: [F, C],
                damage: 60,
                text: 'If a Stadium is in play, this attack does 30 more damage.'
            },
            {
                name: 'Giga Hammer',
                cost: [F, F, C],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Giga Hammer.'
            }];
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Stonjourner';
        this.fullName = 'Stonjourner BST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 30;
                // Discard Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Giga Hammer')) {
                player.active.cannotUseAttacksNextTurnPending.push('Giga Hammer');
            }
        }
        return state;
    }
}
exports.Stonjourner = Stonjourner;
