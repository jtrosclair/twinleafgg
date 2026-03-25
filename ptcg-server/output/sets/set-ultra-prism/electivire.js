"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electivire = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Electivire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electabuzz';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Steel Short',
                cost: [L, C, C],
                damage: 60,
                text: 'If your opponent\'s Active Pokémon is a Metal Pokémon, it is now Paralyzed.'
            },
            {
                name: 'Volt Knuckle',
                cost: [L, L, C, C],
                damage: 130,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Electivire';
        this.fullName = 'Electivire UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Steel Short
        // Ref: AGENTS-patterns.md (conditional paralyzed based on type)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkType = new check_effects_1.CheckPokemonTypeEffect(opponent.active);
            store.reduceEffect(state, checkType);
            if (checkType.cardTypes.includes(card_types_1.CardType.METAL)) {
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Electivire = Electivire;
