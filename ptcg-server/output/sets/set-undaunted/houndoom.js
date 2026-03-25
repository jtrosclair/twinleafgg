"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Houndoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Houndour';
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Fire Breath',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Burned. This power can\'t be used if Houndoom is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Dark Clamp',
                cost: [D, D, C],
                damage: 70,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Houndoom';
        this.fullName = 'Houndoom UD';
        this.FIRE_BREATH_MARKER = 'FIRE_BREATH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FIRE_BREATH_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.FIRE_BREATH_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.FIRE_BREATH_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Houndoom = Houndoom;
