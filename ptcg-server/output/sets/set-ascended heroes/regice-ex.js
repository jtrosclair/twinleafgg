"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regiceex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regiceex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 230;
        this.weakness = [{ type: L }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Regi Charge',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 Basic [W] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Ice Prison',
                cost: [W, C, C, C],
                damage: 140,
                text: 'Discard 2 Energy from this Pokémon, and your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Regice ex';
        this.fullName = 'Regice ex MC';
    }
    reduceEffect(store, state, effect) {
        // Regi Charge attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC
                    && c.provides && c.provides.includes(game_1.CardType.WATER);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 1, max: 2 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        // Ice Prison attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard 2 Energy
            const energyCount = player.active.cards.filter(card => card.superType === game_1.SuperType.ENERGY).length;
            if (energyCount >= 2) {
                state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2 }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        source.moveCardTo(transfer.card, player.discard);
                    }
                });
            }
            // Apply Paralyzed
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.PARALYZED]);
            specialConditionEffect.target = opponent.active;
            return store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Regiceex = Regiceex;
