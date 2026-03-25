"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cling',
                cost: [G, C],
                damage: 20,
                text: 'After your attack, remove from Gloom the number of damage counters equal to the damage you did to the Defending Pokémon. If Gloom has fewer damage counters than that, remove all of them.'
            },
            {
                name: 'Double Razor Leaf',
                cost: [G, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Gloom';
        this.fullName = 'Gloom HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, effect.damage);
            state = store.reduceEffect(state, healEffect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Gloom = Gloom;
