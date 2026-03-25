"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Riolu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Accelerating Stab',
                cost: [F],
                damage: 30,
                text: 'During your next turn, this Pokémon can\'t use Accelerating Stab.'
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Riolu';
        this.fullName = 'Riolu M1L';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Accelerating Stab')) {
                player.active.cannotUseAttacksNextTurnPending.push('Accelerating Stab');
            }
        }
        return state;
    }
}
exports.Riolu = Riolu;
