"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koraidon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Koraidon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Battle Claw',
                cost: [F],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 30 more damage.'
            },
            {
                name: 'Gaia Impact',
                cost: [F, F, C],
                damage: 190,
                text: 'Discard all Energy attached to this Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '45';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Koraidon';
        this.fullName = 'Koraidon M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-breakthrough/raichu-break.ts (Grand Bolt discard all Energy)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player).active.getPokemonCard();
            if (opponent && opponent.stage !== card_types_1.Stage.BASIC) {
                effect.damage += 30;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, effect.player.active.getPokemonCard());
        }
        return state;
    }
}
exports.Koraidon = Koraidon;
