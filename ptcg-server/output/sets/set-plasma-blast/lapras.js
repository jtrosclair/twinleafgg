"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lapras = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Lapras extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Cleanse Away',
                cost: [W, C],
                damage: 0,
                text: 'Heal 30 damage from each of your Benched Pokémon.'
            },
            {
                name: 'Surf',
                cost: [W, C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lapras';
        this.fullName = 'Lapras PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, benched, 30);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Lapras = Lapras;
