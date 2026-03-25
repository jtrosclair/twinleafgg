"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registeelex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Registeelex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 230;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Regi Charge',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 Basic [M] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Protecting Steel',
                cost: [M, C, C, C],
                damage: 140,
                text: 'During your opponent\'s next turn, this Pokemon takes 50 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Registeel ex';
        this.fullName = 'Registeel ex MC';
    }
    reduceEffect(store, state, effect) {
        // Regicharge attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === game_1.SuperType.ENERGY
                    && c.energyType === game_1.EnergyType.BASIC
                    && c.provides && c.provides.includes(game_1.CardType.METAL);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Metal Energy' }, { allowCancel: false, min: 1, max: 2 }), transfers => {
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
        // Protect Steel attack - reduce damage next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.damageReductionNextTurn = 50;
        }
        return state;
    }
}
exports.Registeelex = Registeelex;
