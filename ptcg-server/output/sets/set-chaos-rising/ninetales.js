"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninetales = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ninetales extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vulpix';
        this.hp = 120;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nine-tailed Reflect',
                cost: [R],
                damage: 0,
                text: 'Move all damage counters from 1 of your opponent\'s Benched Pokemon to their Active Pokemon.'
            },
            {
                name: 'Will-o-Wisp',
                cost: [R, R],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.usSetNumber = 'POR 9';
        this.name = 'Ninetales';
        this.fullName = 'Ninetales M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blockedFrom = [];
            let hasDamagedBench = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0 && target.slot !== game_1.SlotType.ACTIVE) {
                    blockedFrom.push(target);
                }
                if (target.slot === game_1.SlotType.ACTIVE) {
                    blockedFrom.push(target);
                }
                if (cardList.damage > 0 && target.slot === game_1.SlotType.BENCH) {
                    hasDamagedBench = true;
                }
            });
            if (!hasDamagedBench) {
                return state;
            }
            const blockedTo = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList !== opponent.active) {
                    blockedTo.push(target);
                }
            });
            return (0, prefabs_1.MOVE_DAMAGE_COUNTERS)(store, state, player, {
                playerType: game_1.PlayerType.TOP_PLAYER,
                slots: [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH],
                min: 0,
                allowCancel: false,
                blockedFrom,
                blockedTo,
                singleSourceTarget: true,
                singleDestinationTarget: true
            });
        }
        return state;
    }
}
exports.Ninetales = Ninetales;
