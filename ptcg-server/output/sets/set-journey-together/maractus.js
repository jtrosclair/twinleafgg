"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maractus = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Maractus extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Explosive Needle',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 6 damage counters on the Attacking Pokémon.',
            }];
        this.attacks = [{
                name: 'Corner',
                cost: [C],
                damage: 20,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Maractus';
        this.fullName = 'Maractus JTG';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this || state.phase !== game_1.GamePhase.ATTACK || (0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            const currentHp = checkHpEffect.hp - effect.target.damage;
            if (effect.damage >= currentHp) {
                effect.source.damage += 60;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Maractus = Maractus;
