"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Hoppip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 30;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bounce',
                cost: [G],
                damage: 10,
                text: 'You may switch Hoppip with 1 of your Benched Pokémon.'
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip HS';
        this.usedSmashTurn = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    this.usedSmashTurn = true;
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSmashTurn) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            this.usedSmashTurn = false;
        }
        return state;
    }
}
exports.Hoppip = Hoppip;
