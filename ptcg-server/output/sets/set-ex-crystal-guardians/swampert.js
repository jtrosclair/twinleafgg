"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swampert = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Swampert extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Marshtomp';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Echo Draw',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may draw a card. This power can\'t be used if Swampert is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Rock Hurl',
                cost: [F, C, C],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Swampert';
        this.fullName = 'Swampert CG';
        this.ECHO_DRAW_MARKER = 'ECHO_DRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (player.marker.hasMarker(this.ECHO_DRAW_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.DRAW_CARDS)(player, 1);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.ECHO_DRAW_MARKER, player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ECHO_DRAW_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && (0, prefabs_1.HAS_MARKER)(this.ECHO_DRAW_MARKER, effect.player, this)) {
            effect.player.marker.removeMarker(this.ECHO_DRAW_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Swampert = Swampert;
