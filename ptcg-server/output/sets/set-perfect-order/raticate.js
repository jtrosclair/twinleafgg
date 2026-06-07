"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raticate = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Raticate extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rattata';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scrape Off',
                cost: [C],
                damage: 20,
                text: 'Before doing damage, you may discard a Pokemon Tool attached to your opponent\'s Active Pokemon.'
            },
            {
                name: 'Countering Incisors',
                cost: [C],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each damage counter on all of your Benched Rattata.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.usSetNumber = 'POR 61';
        this.name = 'Raticate';
        this.fullName = 'Raticate M3';
    }
    reduceEffect(store, state, effect) {
        // Scrape Off - optionally discard Tool
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.tools.length > 0) {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.TOOL }, { min: 0, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        opponent.active.moveCardsTo(cards, opponent.discard);
                    }
                });
            }
        }
        // Countering Incisors - damage based on benched Rattata damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let totalDamageCounters = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList !== player.active) {
                    const pokemonCard = cardList.getPokemonCard();
                    if (pokemonCard && pokemonCard.name === 'Rattata') {
                        totalDamageCounters += Math.floor(cardList.damage / 10);
                    }
                }
            });
            effect.damage = totalDamageCounters * 40;
        }
        return state;
    }
}
exports.Raticate = Raticate;
