"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kabuto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kabuto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Thick Shell',
                powerType: game_1.PowerType.POKEBODY,
                text: 'All damage done by attacks to Kabuto from Evolved Pokémon is reduced by 10 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Scratch',
                cost: [F, C],
                damage: 30,
                text: ''
            }];
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Kabuto';
        this.fullName = 'Kabuto SK';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.getPokemonCard() === this && !prefabs_1.IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
            const opponent = effect.player;
            if (opponent.active.getPokemons().length > 1) {
                effect.damage -= 10;
            }
        }
        return state;
    }
}
exports.Kabuto = Kabuto;
