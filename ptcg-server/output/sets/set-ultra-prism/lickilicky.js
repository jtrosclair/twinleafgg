"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lickilicky = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lickilicky extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lickitung';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dangerous Lick',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Flip a coin until you get tails. This attack does 50 more damage for each heads. If the first flip is tails, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Rolling Tackle',
                cost: [C, C, C, C],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '103';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lickilicky';
        this.fullName = 'Lickilicky UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Dangerous Lick
        // Refs: AGENTS-patterns.md (flip until tails), set-x-and-y/scolipede.ts (paralyzed on condition)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, player, heads => {
                if (heads === 0) {
                    // First flip was tails - paralyze
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
                else {
                    effect.damage += 50 * heads;
                }
            });
        }
        return state;
    }
}
exports.Lickilicky = Lickilicky;
