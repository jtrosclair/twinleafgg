"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorlax = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Snorlax extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 160;
        this.cardType = game_1.CardType.COLORLESS;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Good Sleep',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon remains Asleep during Pokémon Checkup, heal all damage from this Pokémon.'
            }];
        this.attacks = [{
                name: 'Collapse',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'This Pokémon is now Asleep.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Snorlax';
        this.fullName = 'Snorlax 30C';
    }
    reduceEffect(store, state, effect) {
        // Good Sleep
        if (effect instanceof game_phase_effects_1.AfterBetweenTurnsEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card !== this) {
                    return;
                }
                if (!cardList.specialConditions.includes(game_1.SpecialCondition.ASLEEP)) {
                    return;
                }
                if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    return;
                }
                if (cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        // Collapse
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
        }
        return state;
    }
}
exports.Snorlax = Snorlax;
