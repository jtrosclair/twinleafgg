"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatiosStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LatiosStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STAR];
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Miraculous Light',
                cost: [C],
                damage: 10,
                text: 'Remove 1 damage counter and all Special Conditions from Latios Star.'
            },
            {
                name: 'Shining Star',
                cost: [G, L, P],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Stage 2 Evolved Pokémon, discard all Energy cards attached to Latios Star and this attack does 50 damage plus 100 more damage.'
            }
        ];
        this.set = 'DX';
        this.name = 'Latios Star';
        this.fullName = 'Latios Star DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 10);
            const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
            removeSpecialCondition.target = player.active;
            state = store.reduceEffect(state, removeSpecialCondition);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const defending = opponent.active;
            if (((_a = defending.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2 && defending.getPokemons().length > 1) {
                (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.LatiosStar = LatiosStar;
