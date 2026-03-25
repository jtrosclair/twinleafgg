"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyurem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kyurem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 130;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dragon Claw',
                cost: [C, C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Blizzard',
                cost: [W, P, C, C],
                damage: 90,
                text: 'Does 10 damage to each of your opponent\'s Benched Pok\u00e9mon. (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyurem';
        this.fullName = 'Kyurem DRV';
    }
    reduceEffect(store, state, effect) {
        // Blizzard - 90 to active + 10 to each benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 10);
                    damage.target = benched;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.Kyurem = Kyurem;
