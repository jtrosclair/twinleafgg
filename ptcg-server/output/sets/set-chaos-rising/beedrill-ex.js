"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beedrillex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beedrillex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Kakuna';
        this.hp = 310;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bee Rumble',
                cost: [G],
                damage: 110,
                damageCalculation: 'x',
                text: 'This attack does 110 damage for each Beedrill you have in play (including Beedrill ex).'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.usSetNumber = 'POR 3';
        this.name = 'Beedrill ex';
        this.fullName = 'Beedrill ex M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let beedrillCount = 0;
            effect.player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Beedrill' || card.name === 'Beedrill ex') {
                    beedrillCount += 1;
                }
            });
            effect.damage = 110 * beedrillCount;
        }
        return state;
    }
}
exports.Beedrillex = Beedrillex;
