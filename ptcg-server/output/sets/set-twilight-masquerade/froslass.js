"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Froslass extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.cardType = W;
        this.weakness = [{ type: M }];
        this.hp = 90;
        this.retreat = [C];
        this.powers = [{
                name: 'Freezing Shroud',
                powerType: game_1.PowerType.ABILITY,
                text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
            }];
        this.attacks = [{
                name: 'Frost Smash',
                cost: [W, C],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Froslass';
        this.fullName = 'Froslass TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && state.phase === state_1.GamePhase.BETWEEN_TURNS) {
            const player = effect.player;
            // Check if this Froslass is in play on effect.player's side
            let thisIsInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    thisIsInPlay = true;
                }
            });
            if (!thisIsInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name !== 'Froslass') {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                        state = store.reduceEffect(state, new game_effects_1.PlaceDamageCountersEffect(player, cardList, 10, this));
                    }
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name !== 'Froslass') {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                        state = store.reduceEffect(state, new game_effects_1.PlaceDamageCountersEffect(player, cardList, 10, this));
                    }
                }
            });
        }
        return state;
    }
}
exports.Froslass = Froslass;
