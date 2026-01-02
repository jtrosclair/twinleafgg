"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zekromex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zekromex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = L;
        this.hp = 230;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Slash',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Voltage Burst',
                cost: [L, L, C],
                damage: 130,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Prize card your opponent has taken. This Pokémon does 30 damage to itself.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '34';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zekrom ex';
        this.fullName = 'Zekrom ex SV11B';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const additionalDamage = 50 * prizesTaken;
            // Apply additional damage based on prizes taken
            effect.damage += additionalDamage;
            // Apply self-damage
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Zekromex = Zekromex;
