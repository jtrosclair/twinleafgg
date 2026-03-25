"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kabuto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kabuto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Ancient Protection',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Each of your Omanyte, Omastar, Kabuto, Kabutops, and Kabutops ex has no Weakness.'
            }];
        this.attacks = [{
                name: 'Granite Head',
                cost: [C, C],
                damage: 20,
                text: 'During your opponent\'s next turn, any damage done to Kabuto by attacks is reduced by 10 (after applying Weakness and Resistance).'
            }];
        this.set = 'LM';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kabuto';
        this.fullName = 'Kabuto LM';
        this.GRANITE_HEAD_MARKER = 'GRANITE_HEAD_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c, _d, _e;
        // Shield Veil
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            let hasKabutoInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasKabutoInPlay = true;
                }
            });
            if (!hasKabutoInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Omanyte' ||
                ((_b = effect.target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) === 'Omastar' ||
                ((_c = effect.target.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.name) === 'Kabuto' ||
                ((_d = effect.target.getPokemonCard()) === null || _d === void 0 ? void 0 : _d.name) === 'Kabutops' ||
                ((_e = effect.target.getPokemonCard()) === null || _e === void 0 ? void 0 : _e.name) === 'Kabutops ex') {
                effect.weakness = [];
            }
        }
        // Granite Head
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.GRANITE_HEAD_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && (0, prefabs_1.HAS_MARKER)(this.GRANITE_HEAD_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 10;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
            (0, prefabs_1.REMOVE_MARKER)(this.GRANITE_HEAD_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Kabuto = Kabuto;
