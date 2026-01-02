"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggron = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aggron extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lairon';
        this.cardType = M;
        this.hp = 180;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Counter Press',
                cost: [M, C, C],
                damage: 90,
                text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put damage counters on the Attacking Pokémon equal to the damage done to this Pokémon.'
            },
            {
                name: 'Heavy Impact',
                cost: [M, M, C, C],
                damage: 180,
                text: ''
            }];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Aggron';
        this.fullName = 'Aggron CRZ';
        this.COUNTER_PRESS_MARKER = 'COUNTER_PRESS_MARKER';
        this.CLEAR_COUNTER_PRESS_MARKER = 'CLEAR_COUNTER_PRESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            prefabs_1.ADD_MARKER(this.COUNTER_PRESS_MARKER, cardList, this);
            prefabs_1.ADD_MARKER(this.CLEAR_COUNTER_PRESS_MARKER, opponent, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect) && prefabs_1.HAS_MARKER(this.COUNTER_PRESS_MARKER, effect.target, this) && state.phase === game_1.GamePhase.ATTACK) {
            effect.source.damage += effect.damage;
        }
        prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_COUNTER_PRESS_MARKER, this.COUNTER_PRESS_MARKER, this);
        return state;
    }
}
exports.Aggron = Aggron;
