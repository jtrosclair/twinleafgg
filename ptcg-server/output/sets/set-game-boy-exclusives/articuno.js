"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Quickfreeze',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'When you put Articuno into play during your turn (not during set-up), flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.attacks = [{
                name: 'Ice Breath',
                cost: [W, W, W],
                damage: 0,
                text: 'Does 40 damage to 1 of your opponent\'s Pokémon chosen at random. Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
            }];
        this.set = 'GB1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'P03';
        this.name = 'Articuno';
        this.fullName = 'Articuno GB1';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEMON_POWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
            const targets = opponent.getPokemonInPlay();
            const randomIndex = Math.floor(Math.random() * targets.length);
            const target = targets[randomIndex];
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
            return state;
        }
        return state;
    }
}
exports.Articuno = Articuno;
