"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasOddish = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasOddish extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Reckless Charge',
                cost: [G],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Erika\'s Oddish';
        this.fullName = 'Erika\'s Oddish MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.ErikasOddish = ErikasOddish;
