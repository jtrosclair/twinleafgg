"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Peal of Thunder',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'When you put Zapdos into play during your turn (not during set-up), do 30 damage to a Pokémon other than Zapdos chosen at random. (Don\'t apply Weakness and Resistance.)'
            }];
        this.attacks = [{
                name: 'Big Thunder',
                cost: [L, L, L],
                damage: 0,
                text: 'Choose a Pokémon other than Zapdos at random. This attack does 70 damage to that Pokémon. Don\'t apply Weakness or Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
            }];
        this.set = 'GB1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'P10';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos GB1';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEMON_POWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = [...player.getPokemonInPlay(), ...opponent.getPokemonInPlay()]
                .filter(target => target.getPokemonCard() !== this);
            if (targets.length === 0) {
                return state;
            }
            const randomIndex = Math.floor(Math.random() * targets.length);
            const target = targets[randomIndex];
            target.damage += 30;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
            const targets = [...player.getPokemonInPlay(), ...opponent.getPokemonInPlay()]
                .filter(target => target.getPokemonCard() !== this);
            if (targets.length === 0) {
                return state;
            }
            const randomIndex = Math.floor(Math.random() * targets.length);
            const target = targets[randomIndex];
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 70);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
            return state;
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
