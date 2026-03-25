"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xatu = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Xatu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Natu';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Healing Wind',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Active Pokémon. This power can\'t be used if Xatu is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Psyimpact',
                cost: [P, C],
                damage: 0,
                text: 'Put 1 damage counter on each of your opponent\'s Pokémon.'
            }];
        this.set = 'SS';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Xatu';
        this.fullName = 'Xatu SS';
        this.HEALING_WIND_MARKER = 'HEALING_WIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Handle Healing Wind Poké-Power
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.HEALING_WIND_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.HEALING_WIND_MARKER, player, this);
            const target = player.active;
            const healEffect = new game_effects_1.HealEffect(player, target, 10);
            state = store.reduceEffect(state, healEffect);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.HEALING_WIND_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON)(1, store, state, effect);
        }
        return state;
    }
}
exports.Xatu = Xatu;
