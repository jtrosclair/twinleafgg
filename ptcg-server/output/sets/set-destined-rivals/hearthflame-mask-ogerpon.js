"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HearthflameMaskOgerpon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HearthflameMaskOgerpon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flame Dance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic [R] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Searing Flame',
                cost: [R, R, C],
                damage: 80,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            },
        ];
        this.set = 'DRI';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Hearthflame Mask Ogerpon';
        this.fullName = 'Hearthflame Mask Ogerpon DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.ATTACH_ENERGY_PROMPT)(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 0, max: 1, allowCancel: false });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.HearthflameMaskOgerpon = HearthflameMaskOgerpon;
