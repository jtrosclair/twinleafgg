"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zacian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
class Zacian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Limit Break',
                cost: [P, C],
                damage: 50,
                text: 'If your opponent has 3 or fewer Prize cards remaining, this attack does 90 more damage.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Zacian';
        this.fullName = 'Zacian M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent && opponent.getPrizeLeft() <= 3) {
                // Add 90 more damage if opponent has 3 or fewer Prize cards
                const damageEffect = new attack_effects_1.DealDamageEffect(effect, 90);
                damageEffect.target = effect.target;
                return store.reduceEffect(state, damageEffect);
            }
        }
        return state;
    }
}
exports.Zacian = Zacian;
