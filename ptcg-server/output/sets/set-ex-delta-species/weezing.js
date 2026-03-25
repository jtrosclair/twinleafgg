"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weezing = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weezing extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Koffing';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Body Odor',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Weezing is the Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon that has any Poké-Bodies between turns.'
            }];
        this.attacks = [{
                name: 'Mist Attack',
                cost: [G],
                damage: 0,
                text: 'Does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Sludge Whirlpool',
                cost: [G, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'DS';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weezing';
        this.fullName = 'Weezing DS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.POKEBODY)) {
                    const placeCountersEffect = new game_effects_1.PlaceDamageCountersEffect(opponent, cardList, 10, this);
                    state = store.reduceEffect(state, placeCountersEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Weezing = Weezing;
