"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bastiodon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class Bastiodon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Shieldon';
        this.cardType = M;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Ancient Bulwark',
                powerType: game_1.PowerType.ABILITY,
                text: 'While this Pokémon is on your Bench, prevent all damage done to your Pokémon by attacks from your opponent\'s Pokémon that have 2 or fewer Energy attached.',
            }];
        this.attacks = [{
                name: 'Hammer In',
                cost: [M, M, C],
                damage: 160,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '60';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bastiodon';
        this.fullName = 'Bastiodon M5';
    }
    bastiodonProtects(store, state, defenderOwner, source) {
        let hasBastiodon = false;
        const defenderPlayerType = state.players[0] === defenderOwner ? play_card_action_1.PlayerType.BOTTOM_PLAYER : play_card_action_1.PlayerType.TOP_PLAYER;
        defenderOwner.forEachPokemon(defenderPlayerType, (cardList, card) => {
            if (card instanceof Bastiodon && cardList !== defenderOwner.active) {
                if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, defenderOwner, card)) {
                    hasBastiodon = true;
                }
            }
        });
        if (!hasBastiodon) {
            return false;
        }
        const attackerOwner = game_1.StateUtils.findOwner(state, source);
        const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(attackerOwner, source);
        store.reduceEffect(state, checkEnergy);
        const energyCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
        return energyCount <= 2;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && state.phase === game_1.GamePhase.ATTACK) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            const attackerOwner = game_1.StateUtils.findOwner(state, effect.source);
            if (defenderOwner !== attackerOwner
                && attackerOwner === game_1.StateUtils.getOpponent(state, defenderOwner)
                && this.bastiodonProtects(store, state, defenderOwner, effect.source)) {
                effect.damage = 0;
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && state.phase === game_1.GamePhase.ATTACK) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            const attackerOwner = game_1.StateUtils.findOwner(state, effect.source);
            if (defenderOwner !== attackerOwner
                && attackerOwner === game_1.StateUtils.getOpponent(state, defenderOwner)
                && this.bastiodonProtects(store, state, defenderOwner, effect.source)) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Bastiodon = Bastiodon;
