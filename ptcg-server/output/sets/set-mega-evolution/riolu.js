"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
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
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            (0, prefabs_1.BLOCK_EFFECT_IF_MARKER)(this.ATTACK_USED_2_MARKER, effect.player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.ATTACK_USED_MARKER, effect.player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_2_MARKER, this);
        (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        return state;
    }
}
exports.Riolu = Riolu;
