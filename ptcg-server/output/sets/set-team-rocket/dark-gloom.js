"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkGloom = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class DarkGloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.tags = [card_types_1.CardTag.DARK];
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Pollen Stench',
                powerType: game_1.PowerType.POKEMON_POWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Confused; if tails, your Active Pokémon is now Confused. This power can\'t be used if Dark Gloom is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Poisonpowder',
                cost: [G, G],
                damage: 10,
                text: 'The Defending Pokémon is now Poisoned.'
            },
        ];
        this.set = 'TR';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Gloom';
        this.fullName = 'Dark Gloom TR';
        this.POLLEN_STENCH_MARKER = 'POLLEN_STENCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.POLLEN_STENCH_MARKER, player, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.POLLEN_STENCH_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
                else {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, player, this);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.POLLEN_STENCH_MARKER, this);
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.DarkGloom = DarkGloom;
