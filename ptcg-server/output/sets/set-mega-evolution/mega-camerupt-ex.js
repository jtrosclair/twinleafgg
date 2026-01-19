"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaCameruptEx = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaCameruptEx extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Numel';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 340;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Roasting Heat',
                cost: [R],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is Burned, this attack does 160 more damage.',
            },
            {
                name: 'Volcano Meteor',
                cost: [R, C, C, C],
                damage: 280,
                text: 'Discard 2 Energy from this Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Camerupt ex';
        this.fullName = 'Mega Camerupt ex M1L';
    }
    reduceEffect(store, state, effect) {
        // Roasting Heat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const activePokemon = opponent.active;
            // Check if opponent's active Pokémon is burned
            if (activePokemon.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                effect.damage += 160;
            }
        }
        // Volcano Meteor
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check if this Pokémon has at least 2 energy attached
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
        }
        return state;
    }
}
exports.MegaCameruptEx = MegaCameruptEx;
