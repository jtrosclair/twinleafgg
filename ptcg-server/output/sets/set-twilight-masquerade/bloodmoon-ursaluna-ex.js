"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodmoonUrsalunaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BloodmoonUrsalunaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 260;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Seasoned Skill',
                powerType: game_1.PowerType.ABILITY,
                text: 'Blood Moon used by this Pokémon costs [C] less for each Prize card your opponent has taken.'
            }];
        this.attacks = [{
                name: 'Blood Moon',
                cost: [C, C, C, C, C],
                damage: 240,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '141';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bloodmoon Ursaluna ex';
        this.fullName = 'Bloodmoon Ursaluna ex TWM';
    }
    // public getColorlessReduction(state: State): number {
    //   const player = state.players[state.activePlayer];
    //   const opponent = StateUtils.getOpponent(state, player);
    //   const remainingPrizes = opponent.getPrizeLeft();
    //   return 6 - remainingPrizes;
    // }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if (index === -1) {
                return state;
            }
            const remainingPrizes = opponent.getPrizeLeft();
            const prizeToColorlessReduction = {
                5: 1,
                4: 2,
                3: 3,
                2: 4,
                1: 5
            };
            const colorlessToRemove = prizeToColorlessReduction[remainingPrizes] || 0;
            for (let i = 0; i < colorlessToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            return state;
        }
        // Blood Moon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.BloodmoonUrsalunaex = BloodmoonUrsalunaex;
