"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torracat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Torracat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litten';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Bite',
                cost: [R],
                damage: 30,
                text: ''
            },
            {
                name: 'Flare Strike',
                cost: [R, C, C],
                damage: 80,
                text: 'During your next turn, this Pokémon can\'t use Flare Strike.'
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Torracat';
        this.fullName = 'Torracat TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Pushed "Flare Strike" into cannotUseAttacksNextTurnPending if missing.
            //
            // Converted to prefab version (THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN).
            (0, prefabs_1.THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN)(player, this.attacks[1]);
        }
        return state;
    }
}
exports.Torracat = Torracat;
