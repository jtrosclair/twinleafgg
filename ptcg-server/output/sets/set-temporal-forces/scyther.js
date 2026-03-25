"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cut Up',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Slashing Strike',
                cost: [C, C],
                damage: 60,
                text: 'During your next turn, this Pokémon can\'t use Slashing Strike.'
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.name = 'Scyther';
        this.fullName = 'Scyther TEF';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Slashing Strike
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Pushed "Slashing Strike" into cannotUseAttacksNextTurnPending if missing.
            //
            // Converted to prefab version (THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN).
            (0, prefabs_1.THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN)(player, this.attacks[1]);
        }
        return state;
    }
}
exports.Scyther = Scyther;
