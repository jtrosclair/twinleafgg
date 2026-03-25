"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaLucarioex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaLucarioex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 340;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Aura Jab',
                cost: [F],
                damage: 130,
                text: 'Attach up to 3 Basic [F] Energy cards from your discard pile to your Benched Pokemon in any way you like.',
            },
            {
                name: 'Mega Brave',
                cost: [F, F],
                damage: 270,
                text: 'During your next turn, this Pokémon can\'t use Mega Brave.',
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Lucario ex';
        this.fullName = 'Mega Lucario ex M1L';
    }
    reduceEffect(store, state, effect) {
        // Aura Jab
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Mega Brave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Mega Brave')) {
                player.active.cannotUseAttacksNextTurnPending.push('Mega Brave');
            }
        }
        return state;
    }
}
exports.MegaLucarioex = MegaLucarioex;
