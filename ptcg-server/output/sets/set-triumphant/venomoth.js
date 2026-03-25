"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venomoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Venomoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Venonat';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Poison Moth Wind',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, your opponent\'s Active Pokémon is now Poisoned. If tails, your Active Pokémon is now Poisoned. This power can\'t be used if Venomoth is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Stun Spore',
                cost: [G, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Venomoth';
        this.fullName = 'Venomoth TM';
        this.POISON_MOTH_WIND_MARKER = 'POISON_MOTH_WIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.POISON_MOTH_WIND_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.POISON_MOTH_WIND_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.POISON_MOTH_WIND_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
                else {
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, player, this);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Venomoth = Venomoth;
