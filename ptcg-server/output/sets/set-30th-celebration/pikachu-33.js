"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu33 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #33 — Keep Hidden + Tiny Charge */
class Pikachu33 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Keep Hidden',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, prevent all damage from and effects of attacks from your opponent\'s Pokémon done to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Tiny Charge',
                cost: [game_1.CardType.LIGHTNING],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 33';
    }
    reduceEffect(store, state, effect) {
        // Keep Hidden
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.target === owner.active) {
                return state;
            }
            if (effect.player === owner) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, this)) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Pikachu33 = Pikachu33;
