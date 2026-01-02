"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hypno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hypno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drowzee';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Goodnight, Babies',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may leave both Active Pokémon Asleep.'
            }];
        this.attacks = [
            {
                name: 'Zen Headbutt',
                cost: [P, P],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BKP';
        this.name = 'Hypno';
        this.fullName = 'Hypno BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.GOODNIGHT_MARKER = 'GOODNIGHT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.GOODNIGHT_MARKER, effect.player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.GOODNIGHT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.ADD_MARKER(this.GOODNIGHT_MARKER, player, this);
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
            return state;
        }
        return state;
    }
}
exports.Hypno = Hypno;
