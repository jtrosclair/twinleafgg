"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sableye extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = game_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [game_1.CardType.DARK],
                damage: 20,
                text: ''
            },
            {
                name: 'Damage Collection',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Sableye';
        this.fullName = 'Sableye TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
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
            // Legacy implementation:
            // - Built a custom MoveDamagePrompt scoped to opponent targets.
            // - Manually enforced source != opponent active and destination == opponent active.
            // - Moved damage counters one by one from benched sources to opponent active.
            //
            // Converted to prefab version (MOVE_DAMAGE_COUNTERS).
            return (0, prefabs_1.MOVE_DAMAGE_COUNTERS)(store, state, player, {
                playerType: game_1.PlayerType.TOP_PLAYER,
                slots: [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH],
                min: 0,
                allowCancel: false,
                blockedFrom,
                blockedTo,
                singleDestinationTarget: true
            });
        }
        return state;
    }
}
exports.Sableye = Sableye;
