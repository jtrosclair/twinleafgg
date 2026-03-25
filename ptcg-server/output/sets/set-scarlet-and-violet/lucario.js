"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lucario = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Avenging Knuckle',
                cost: [F],
                damage: 30,
                damageCalculation: '+',
                text: 'If any of your [F] Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 120 more damage.'
            },
            {
                name: 'Accelerating Stab',
                cost: [F, C, C],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Accelerating Stab.'
            }];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.evolvesFrom = 'Riolu';
        this.name = 'Lucario';
        this.fullName = 'Lucario SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 120;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Accelerating Stab')) {
                player.active.cannotUseAttacksNextTurnPending.push('Accelerating Stab');
            }
        }
        return state;
    }
}
exports.Lucario = Lucario;
