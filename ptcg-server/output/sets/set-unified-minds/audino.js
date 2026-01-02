"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Audino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Hearing',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may draw a card.'
            }];
        this.attacks = [{
                name: 'Drain Slap',
                cost: [C, C],
                damage: 30,
                text: 'Heal 30 damage from this Pokémon.'
            }];
        this.set = 'UNM';
        this.name = 'Audino';
        this.fullName = 'Audino UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '177';
        this.HEARING_MARKER = 'HEARING_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEARING_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.HEARING_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.DRAW_CARDS(player, 1);
            player.marker.addMarker(this.HEARING_MARKER, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const healEffect = new game_effects_1.HealEffect(effect.player, effect.player.active, 30);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Audino = Audino;
