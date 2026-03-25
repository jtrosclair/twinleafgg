"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haxorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Haxorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fraxure';
        this.cardType = N;
        this.hp = 170;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Cross-Cut',
                cost: [C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 80 more damage.'
            },
            {
                name: 'Axe Bomber',
                cost: [F, M, C],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon is a Basic Pokémon, it is Knocked Out.'
            }
        ];
        this.set = 'BLK';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Haxorus';
        this.fullName = 'Haxorus SV11B';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.stage !== card_types_1.Stage.BASIC)) {
                effect.damage += 80;
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.stage === card_types_1.Stage.BASIC)) {
                const knockOut = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                knockOut.target = opponent.active;
                state = store.reduceEffect(state, knockOut);
            }
            return state;
        }
        return state;
    }
}
exports.Haxorus = Haxorus;
