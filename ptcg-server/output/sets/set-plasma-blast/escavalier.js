"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Escavalier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Escavalier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Karrablast';
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Steamroll',
                cost: [M, C],
                damage: 40,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pok\u00e9mon. (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
            },
            {
                name: 'Slashing Strike',
                cost: [M, C, C],
                damage: 80,
                text: 'This Pok\u00e9mon can\'t use Slashing Strike during your next turn.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Escavalier';
        this.fullName = 'Escavalier PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
                player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
            }
        }
        return state;
    }
}
exports.Escavalier = Escavalier;
