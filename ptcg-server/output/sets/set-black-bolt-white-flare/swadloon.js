"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swadloon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swadloon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sewaddle';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Healing Leaves',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may heal 20 damage from your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Bug Buzz',
                cost: [G, C],
                damage: 40,
                text: ''
            }];
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Swadloon';
        this.fullName = 'Swadloon WHT';
        this.HEALING_LEAVES_MARKER = 'HEALING_LEAVES_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.HEALING_LEAVES_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.HEALING_LEAVES_MARKER, this);
            const healEffect = new game_effects_1.HealEffect(player, player.active, 20);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEALING_LEAVES_MARKER, this);
        return state;
    }
}
exports.Swadloon = Swadloon;
