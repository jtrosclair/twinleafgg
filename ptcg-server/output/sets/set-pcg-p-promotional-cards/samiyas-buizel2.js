"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamiyasBuizel2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class SamiyasBuizel2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Razor Wind',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
            {
                name: 'Smash Turn',
                cost: [W, C],
                damage: 20,
                text: 'After your attack, you may switch Samiya\'s Buizel with 1 of your Benched Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'Samiya\'s Buizel';
        this.fullName = 'Samiya\'s Buizel PCGP 151';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.usedSmashTurn = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedSmashTurn = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSmashTurn) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
            this.usedSmashTurn = false;
        }
        return state;
    }
}
exports.SamiyasBuizel2 = SamiyasBuizel2;
