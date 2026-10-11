"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vivillon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vivillon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Spewpa';
        this.hp = 120;
        this.cardType = game_1.CardType.GRASS;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Guiding Dance',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may use this Ability. Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Poison Powder',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 60,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Vivillon';
        this.fullName = 'Vivillon 30C';
        this.GUIDING_DANCE_MARKER = 'GUIDING_DANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Guiding Dance
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.GUIDING_DANCE_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { min: 0, max: 1 });
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.GUIDING_DANCE_MARKER, this);
        // Poison Powder
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
        }
        return state;
    }
}
exports.Vivillon = Vivillon;
