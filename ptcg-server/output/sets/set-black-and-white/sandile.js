"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sandile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sand-Attack',
                cost: [F],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon\'s attacks do nothing during your opponent\'s next turn.'
            },
            {
                name: 'Bite',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Sandile';
        this.fullName = 'Sandile BLW';
        this.SAND_ATTACK_MARKER = 'SAND_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    opponent.active.marker.addMarker(this.SAND_ATTACK_MARKER, this);
                }
            });
        }
        // Block attacks if marked
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.SAND_ATTACK_MARKER, this)) {
            effect.damage = 0;
            effect.preventDefault = true;
        }
        // Clean up marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.SAND_ATTACK_MARKER, this);
        }
        return state;
    }
}
exports.Sandile = Sandile;
