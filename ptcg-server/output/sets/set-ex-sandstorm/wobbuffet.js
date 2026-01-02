"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wobbuffet = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Wobbuffet extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Safeguard',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Prevent all effects of attacks, including damage, done to Wobbuffet by your opponent\'s Pokémon-ex.'
            }];
        this.attacks = [{
                name: 'Flip Over',
                cost: [P, C, C],
                damage: 50,
                text: 'Wobbuffet does 10 damage to itself, and don\'t apply Weakness and Resistance to this damage.'
            }];
        this.set = 'SS';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wobbuffet';
        this.fullName = 'Wobbuffet SS';
    }
    reduceEffect(store, state, effect) {
        // Prevent damage from Pokemon-ex
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(game_1.CardTag.POKEMON_ex)) {
                effect.preventDefault = true;
            }
        }
        // Handle Flip Over self-damage
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const target = player.active;
            if (target.cards.includes(this)) {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.attackEffect.ignoreResistance = true;
                damageEffect.attackEffect.ignoreWeakness = true;
                store.reduceEffect(state, damageEffect);
            }
        }
        return state;
    }
}
exports.Wobbuffet = Wobbuffet;
