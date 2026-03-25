"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastformSnowyForm = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CastformSnowyForm extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [];
        this.powers = [{
                name: 'Weather Reading',
                text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: false,
            }];
        this.attacks = [{
                name: 'Frosty Typhoon',
                cost: [W, W, C],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Frosty Typhoon.'
            }];
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Castform Snowy Form';
        this.fullName = 'Castform Snowy Form CRE';
    }
    getColorlessReduction(state) {
        const player = state.players[state.activePlayer];
        const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
        return stadiumsInDiscard >= 8 ? 2 : 0;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Frosty Typhoon')) {
                player.active.cannotUseAttacksNextTurnPending.push('Frosty Typhoon');
            }
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (stadiumsInDiscard >= 8) {
                const costToRemove = 3;
                for (let i = 0; i < costToRemove; i++) {
                    let index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                    else {
                        index = effect.cost.indexOf(card_types_1.CardType.WATER);
                        if (index !== -1) {
                            effect.cost.splice(index, 1);
                        }
                    }
                }
            }
        }
        return state;
    }
}
exports.CastformSnowyForm = CastformSnowyForm;
