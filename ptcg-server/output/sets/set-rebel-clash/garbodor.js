"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garbodor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Garbodor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trubbish';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Poisonous Puddle',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if a Stadium is in play, you may make your opponent\'s Active Pokémon Poisoned.'
            }];
        this.attacks = [{
                name: 'Sludge Bomb',
                cost: [D, C, C],
                damage: 80,
                text: ''
            }];
        this.set = 'RCL';
        this.regulationMark = 'D';
        this.name = 'Garbodor';
        this.fullName = 'Garbodor RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.POISON_STRUCTURE_MARKER = 'POISON_STRUCTURE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard === undefined) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.POISON_STRUCTURE_MARKER, player, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (opponent.active) {
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            }
            (0, prefabs_1.ADD_MARKER)(this.POISON_STRUCTURE_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.POISON_STRUCTURE_MARKER, player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.POISON_STRUCTURE_MARKER, this);
        return state;
    }
}
exports.Garbodor = Garbodor;
