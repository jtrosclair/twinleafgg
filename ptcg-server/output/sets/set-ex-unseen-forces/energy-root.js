"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyRoot = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EnergyRoot extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.TOOL;
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Energy Root';
        this.fullName = 'Energy Root UF';
        this.text = 'As long as Energy Root is attached to a Pokémon, that Pokémon gets +20 HP and can\'t use any Poké-Powers or Poké-Bodies.';
        this.HP_BONUS = 20;
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.tools.includes(this)) {
            const card = effect.target.getPokemonCard();
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (card === undefined) {
                return state;
            }
            effect.hp += this.HP_BONUS;
        }
        if (effect instanceof game_effects_1.PowerEffect
            && !(0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)
            && (effect.power.powerType === game_1.PowerType.POKEPOWER || effect.power.powerType === game_1.PowerType.POKEBODY)) {
            const pokemonSlot = (_a = effect.target) !== null && _a !== void 0 ? _a : game_1.StateUtils.findPokemonSlot(state, effect.card);
            if (pokemonSlot === null || pokemonSlot === void 0 ? void 0 : pokemonSlot.tools.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        return state;
    }
}
exports.EnergyRoot = EnergyRoot;
