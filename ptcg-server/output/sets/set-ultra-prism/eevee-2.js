"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eevee2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Palette of Friends',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage for each different type of Pokémon on your Bench.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '105';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eevee';
        this.fullName = 'Eevee UPR 105';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Palette of Friends
        // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - counting across bench)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const types = new Set();
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const pokemonCard = benchSlot.getPokemonCard();
                    if (pokemonCard) {
                        // Check the actual type via CheckPokemonTypeEffect
                        const checkType = new check_effects_1.CheckPokemonTypeEffect(benchSlot);
                        store.reduceEffect(state, checkType);
                        checkType.cardTypes.forEach(t => types.add(t));
                    }
                }
            });
            effect.damage = 10 * types.size;
        }
        return state;
    }
}
exports.Eevee2 = Eevee2;
