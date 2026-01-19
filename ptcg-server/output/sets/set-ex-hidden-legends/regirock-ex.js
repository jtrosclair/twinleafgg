"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regirockex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regirockex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Healing Stone',
                powerType: game_1.PowerType.POKEBODY,
                text: 'At any time between turns, remove 1 damage counter from Regirock ex.'
            }];
        this.attacks = [{
                name: 'Tonnage',
                cost: [F, F, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may do 60 damage plus 20 more damage. If you do, Regirock ex does 30 damage to itself.'
            }];
        this.set = 'HL';
        this.setNumber = '98';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Regirock ex';
        this.fullName = 'Regirock ex HL';
    }
    reduceEffect(store, state, effect) {
        // Handle Healing Stone Poké-Body
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.ANY, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                    state = store.reduceEffect(state, healEffect);
                }
            });
        }
        // Handle Tonnage attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 20;
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
                }
            });
        }
        return state;
    }
}
exports.Regirockex = Regirockex;
