"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beheeyem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Beheeyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Elgyem';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Synchronoise',
                cost: [P],
                damage: 20,
                text: 'Does 20 damage to each of your opponent\'s Benched Pokémon that shares a type with the Defending Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Psyshot',
                cost: [P, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'NVI';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beheeyem';
        this.fullName = 'Beheeyem NVI';
    }
    reduceEffect(store, state, effect) {
        // Synchronoise - damage benched Pokémon of same type as active
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Get defending Pokémon's type(s)
            const defendingTypeEffect = new check_effects_1.CheckPokemonTypeEffect(opponent.active);
            store.reduceEffect(state, defendingTypeEffect);
            const defendingTypes = defendingTypeEffect.cardTypes;
            // Damage each benched Pokémon that shares a type
            opponent.bench.forEach(benchSlot => {
                if (benchSlot.cards.length === 0) {
                    return;
                }
                const benchTypeEffect = new check_effects_1.CheckPokemonTypeEffect(benchSlot);
                store.reduceEffect(state, benchTypeEffect);
                const benchTypes = benchTypeEffect.cardTypes;
                // Check if any types match
                const sharesType = benchTypes.some(type => defendingTypes.includes(type));
                if (sharesType) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = benchSlot;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Beheeyem = Beheeyem;
