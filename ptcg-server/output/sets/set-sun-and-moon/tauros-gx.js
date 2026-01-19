"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaurosGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TaurosGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 180;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Rage',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Horn Attack',
                cost: [C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Mad Bull-GX',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                gxAttack: true,
                text: 'This attack does 30 damage for each damage counter on this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SUM';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tauros-GX';
        this.fullName = 'Tauros-GX SUM';
    }
    reduceEffect(store, state, effect) {
        // Rage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage += effect.player.active.damage;
        }
        // Mad Bull-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            // Check if player has used GX attack
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // set GX attack as used for game
            player.usedGX = true;
            effect.damage = player.active.damage * 3;
        }
        return state;
    }
}
exports.TaurosGX = TaurosGX;
