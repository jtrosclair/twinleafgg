"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Muk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Stench',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Muk is your Active Pokémon, each player\'s Pokémon can\'t use any Poké-Powers.'
            }];
        this.attacks = [{
                name: 'Poison Ring',
                cost: [G, C],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Sludge Toss',
                cost: [G, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Muk';
        this.fullName = 'Muk LM';
        this.POISON_RING_MARKER = 'POISON_RING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.POKEPOWER) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Muk is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Muk = Muk;
