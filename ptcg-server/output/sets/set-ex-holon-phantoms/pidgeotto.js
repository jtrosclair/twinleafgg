"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Pidgeotto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Whirlwind',
                cost: [L, C],
                damage: 30,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.',
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Pidgeotto';
        this.fullName = 'Pidgeotto HP';
        this.usedWhirlwind = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedWhirlwind = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWhirlwind === true) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
        }
        return state;
    }
}
exports.Pidgeotto = Pidgeotto;
