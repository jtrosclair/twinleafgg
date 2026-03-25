"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sawk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sawk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Five Fierce Chops',
                cost: [F, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 5 coins. This attack does 20 damage times the number of heads. This Pokémon can\'t attack during your next turn.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Sawk';
        this.fullName = 'Sawk EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 5, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 20 * heads;
            });
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Sawk = Sawk;
