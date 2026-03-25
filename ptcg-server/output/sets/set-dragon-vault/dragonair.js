"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = N;
        this.hp = 70;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Tail Whap',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Dragon Pulse',
                cost: [G, L, C],
                damage: 70,
                text: 'Discard the top card of your deck.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair DRV';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 1, this, effect.attack);
        }
        return state;
    }
}
exports.Dragonair = Dragonair;
