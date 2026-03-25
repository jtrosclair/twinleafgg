"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snover = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Snover extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Ice Shard',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Fighting Pokémon, this attack does 40 more damage.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Snover';
        this.fullName = 'Snover UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Ice Shard
        // Ref: set-ultra-prism/electivire.ts (Steel Short - conditional damage based on type)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkType = new check_effects_1.CheckPokemonTypeEffect(opponent.active);
            store.reduceEffect(state, checkType);
            if (checkType.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Snover = Snover;
