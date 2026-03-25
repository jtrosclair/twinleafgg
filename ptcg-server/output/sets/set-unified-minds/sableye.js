"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.retreat = [C];
        this.MIRROR_GEM_MARKER = 'SABLEYE_UNM_MIRROR_GEM_MARKER';
        this.CLEAR_MIRROR_GEM_MARKER = 'SABLEYE_UNM_CLEAR_MIRROR_GEM_MARKER';
        this.attacks = [
            {
                name: 'Mirror Gem',
                cost: [D],
                damage: 10,
                text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if it is Knocked Out), put 8 damage counters on the Attacking Pokémon.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '133';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sableye';
        this.fullName = 'Sableye UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Mirror Gem
        // Ref: set-unbroken-bonds/aggron.ts (Extra-Tight Press - retaliation damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.MIRROR_GEM_MARKER, player.active, this);
            (0, prefabs_1.ADD_MARKER)(this.CLEAR_MIRROR_GEM_MARKER, opponent, this);
        }
        // Retaliate when damaged
        if ((0, prefabs_1.ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT)(state, effect, { source: this })) {
            if (effect.target.marker.hasMarker(this.MIRROR_GEM_MARKER, this)) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 80);
                damageEffect.target = effect.source;
                store.reduceEffect(state, damageEffect);
            }
        }
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, this.CLEAR_MIRROR_GEM_MARKER, this.MIRROR_GEM_MARKER, this);
        return state;
    }
}
exports.Sableye = Sableye;
