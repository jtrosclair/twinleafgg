"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmonlee = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Hitmonlee extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Stages of Evolution',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Hitmonlee is an Evolved Pokémon, Hitmonlee\'s attacks do 20 more damage to your opponent\'s Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Stretch Kick',
                cost: [F],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Benched Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Mega Kick',
                cost: [F, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'UF';
        this.name = 'Hitmonlee';
        this.fullName = 'Hitmonlee UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
        }
        if (effect instanceof attack_effects_2.PutDamageEffect && effect.source.getPokemonCard() === this) {
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (effect.source.getPokemons().length > 1) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.Hitmonlee = Hitmonlee;
