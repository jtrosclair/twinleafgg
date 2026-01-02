"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kecleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kecleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Colorful Body',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Kecleon\'s type is [G][R][W][L][P][F][D][M][C].'
            }];
        this.attacks = [{
                name: 'Triple Smash',
                cost: [C, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip 3 coins. This attack does 10 damage plus 20 more damage for each heads.'
            }];
        this.set = 'RR';
        this.name = 'Kecleon';
        this.fullName = 'Kecleon RR';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect
            && effect.target.getPokemonCard() === this
            && !prefabs_1.IS_POKEBODY_BLOCKED(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            effect.cardTypes = [G, R, W, L, P, F, D, M, C];
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Kecleon = Kecleon;
