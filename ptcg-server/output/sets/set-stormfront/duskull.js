"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D, value: +10 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Counting Song',
                cost: [],
                damage: 0,
                text: 'Put up to 3 damage counters on Duskull. Then, put that many damage counters on the Defending Pokémon.'
            },
            {
                name: 'Ram',
                cost: [P],
                damage: 10,
                text: ''
            },
            {
                name: 'Night Bind',
                cost: [P, C],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent can\'t attach any Energy cards from his or her hand to the Active Pokémon during his or her next turn.'
            }];
        this.set = 'SF';
        this.name = 'Duskull';
        this.fullName = 'Duskull SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'SH2';
        this.NIGHT_BIND_MARKER = 'NIGHT_BIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.source.damage += 30;
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(3, store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_MARKER)(this.NIGHT_BIND_MARKER, effect.opponent, this);
                }
            });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target === effect.player.active && (0, prefabs_1.HAS_MARKER)(this.NIGHT_BIND_MARKER, effect.player, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if ((0, prefabs_1.HAS_MARKER)(this.NIGHT_BIND_MARKER, effect.player, this)) {
                (0, prefabs_1.REMOVE_MARKER)(this.NIGHT_BIND_MARKER, effect.player, this);
            }
        }
        return state;
    }
}
exports.Duskull = Duskull;
