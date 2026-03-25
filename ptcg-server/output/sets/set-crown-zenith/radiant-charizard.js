"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantCharizard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RadiantCharizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Excited Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost [C] less for each Prize card your opponent has taken.'
            }];
        this.attacks = [
            {
                name: 'Combustion Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t use Combustion Blast.'
            }
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Radiant Charizard';
        this.fullName = 'Radiant Charizard CRZ';
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
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            // No cost to reduce
            if (index === -1 || (0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            for (let i = 0; i < opponent.prizesTaken; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Combustion Blast')) {
                player.active.cannotUseAttacksNextTurnPending.push('Combustion Blast');
            }
        }
        return state;
    }
}
exports.RadiantCharizard = RadiantCharizard;
