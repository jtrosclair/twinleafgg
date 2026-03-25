"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swoobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Swoobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Woobat';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [P],
                damage: 30,
                text: ''
            },
            {
                name: 'Phat Sound',
                cost: [P, C],
                damage: 0,
                text: 'Flip 3 coins. This attack does 10 damage times the number of heads to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Swoobat';
        this.fullName = 'Swoobat EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                if (heads > 0) {
                    const damage = 10 * heads;
                    // Damage to active with weakness/resistance
                    const dealDamage = new attack_effects_1.DealDamageEffect(effect, damage);
                    dealDamage.target = opponent.active;
                    store.reduceEffect(state, dealDamage);
                    // Damage to bench without weakness/resistance
                    opponent.bench.forEach(bench => {
                        if (bench.cards.length > 0) {
                            const putDamage = new attack_effects_1.PutDamageEffect(effect, damage);
                            putDamage.target = bench;
                            store.reduceEffect(state, putDamage);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Swoobat = Swoobat;
