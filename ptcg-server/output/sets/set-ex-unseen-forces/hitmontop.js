"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmontop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Hitmontop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Stages of Evolution',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Hitmontop is an Evolved Pokémon, is your Active Pokémon, and is damaged by an opponent\'s attack(even if Hitmontop is Knocked Out), put 2 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Upward Kick',
                cost: [F, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has at least 2 damage counters on it, this attack does 20 damage plus 30 more damage.'
            },
            {
                name: 'Spiral Kick',
                cost: [C, C, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Hitmontop';
        this.fullName = 'Hitmontop UF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === state_1.GamePhase.ATTACK) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = effect.player;
            if (player === opponent || player.active !== effect.target)
                return state;
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.target.getPokemons().length > 1) {
                effect.source.damage += 20;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.opponent.active.damage >= 20) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Hitmontop = Hitmontop;
