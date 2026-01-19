"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Numel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 40;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dense',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Numel by attacks from Evolved Pokémon (both yours and your opponent\'s) is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Numel';
        this.fullName = 'Numel DX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            if (effect.source.getPokemons().length > 1) {
                effect.damage -= 20;
            }
        }
        return state;
    }
}
exports.Numel = Numel;
