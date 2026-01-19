"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kakuna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kakuna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Weedle';
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Stiffen',
                cost: [G],
                damage: 0,
                text: 'During your opponent\'s next turn, this Pokémon takes 40 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.set = 'CRE';
        this.name = 'Kakuna';
        this.fullName = 'Kakuna CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.regulationMark = 'E';
        this.STIFFEN_MARKER = 'STIFFEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.STIFFEN_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && (0, prefabs_1.HAS_MARKER)(this.STIFFEN_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this) && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 40;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
            (0, prefabs_1.REMOVE_MARKER)(this.STIFFEN_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Kakuna = Kakuna;
