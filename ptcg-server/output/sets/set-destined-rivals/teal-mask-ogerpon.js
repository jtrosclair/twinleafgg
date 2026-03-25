"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TealMaskOgerpon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TealMaskOgerpon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Grass Dance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic [G] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Ogre Hammer',
                cost: [G, G, C],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Ogre Hammer.'
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Teal Mask Ogerpon';
        this.fullName = 'Teal Mask Ogerpon DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.ATTACH_ENERGY_PROMPT)(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Grass Energy' }, { min: 0, max: 1, allowCancel: false });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Ogre Hammer')) {
                player.active.cannotUseAttacksNextTurnPending.push('Ogre Hammer');
            }
        }
        return state;
    }
}
exports.TealMaskOgerpon = TealMaskOgerpon;
