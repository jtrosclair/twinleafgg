"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegigigasEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RegigigasEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 180;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Giga Power',
                cost: [C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may do 20 more damage. If you do, this Pokémon does 20 damage to itself.'
            },
            {
                name: 'Raging Hammer',
                cost: [C, C, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Regigigas-EX';
        this.fullName = 'Regigigas-EX NXD';
    }
    reduceEffect(store, state, effect) {
        // Giga Power
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_DEAL_MORE_DAMAGE), result => {
                if (result) {
                    effect.damage += 20;
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
                }
            });
        }
        // Raging Hammer
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const damageCounters = Math.floor(player.active.damage / 10);
            effect.damage += damageCounters * 10;
        }
        return state;
    }
}
exports.RegigigasEx = RegigigasEx;
