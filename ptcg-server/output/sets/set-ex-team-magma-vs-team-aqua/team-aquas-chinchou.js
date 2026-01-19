"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasChinchou = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasChinchou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Confuse Ray',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Wave Splash',
                cost: [L, C],
                damage: 20,
                text: ''
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Team Aqua\'s Chinchou';
        this.fullName = 'Team Aqua\'s Chinchou MA';
        this.usedConfuseRay = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedConfuseRay = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedConfuseRay) {
            this.usedConfuseRay = false;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.TeamAquasChinchou = TeamAquasChinchou;
