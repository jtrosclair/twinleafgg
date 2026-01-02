"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cobalion = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cobalion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Holy Edge',
                cost: [M],
                damage: 20,
                text: 'Discard 1 Special Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Metal Arms',
                cost: [M, M, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokemon has a Pokemon Tool attached, this attack does 40 more damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cobalion';
        this.fullName = 'Cobalion SV11B';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            const specialEnergies = active.cards.filter(card => card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.SPECIAL);
            if (specialEnergies.length === 0) {
                return state; // Nothing to discard
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, active, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    active.moveCardsTo(selected, opponent.discard);
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const active = player.active;
            const toolCards = active.cards.filter(card => card instanceof game_1.TrainerCard && card.trainerType === game_1.TrainerType.TOOL);
            if (toolCards.length > 0) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Cobalion = Cobalion;
