"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Abomasnow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Abomasnow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snover';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Razor Leaf',
                cost: [G, G],
                damage: 40,
                text: ''
            },
            {
                name: 'Bang Heads',
                cost: [G, G, C],
                damage: 80,
                text: 'Both this Pokémon and the Defending Pokémon are now Confused.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Abomasnow';
        this.fullName = 'Abomasnow PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, player, this);
        }
        return state;
    }
}
exports.Abomasnow = Abomasnow;
