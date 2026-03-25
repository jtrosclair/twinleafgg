"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copperajah = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Copperajah extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cufant';
        this.cardType = M;
        this.hp = 200;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Massive Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.'
            }];
        this.attacks = [{
                name: 'Nasal Lariat',
                cost: [M, M, M, C],
                damage: 130,
                damageCalculation: '+',
                text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.name = 'Copperajah';
        this.fullName = 'Copperajah SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.OPPONENT_CANNOT_PLAY_STADIUMS_MARKER = 'OPPONENT_CANNOT_PLAY_STADIUMS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayStadiumEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (opponent.active.getPokemonCard() == this) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    effect.damage += 100;
                    player.active.cannotAttackNextTurnPending = true;
                }
            });
        }
        return state;
    }
}
exports.Copperajah = Copperajah;
