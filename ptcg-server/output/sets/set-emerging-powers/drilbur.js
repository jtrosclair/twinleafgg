"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drilbur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Drilbur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Hone Claws',
                cost: [C],
                damage: 0,
                text: 'During your next turn, each of this Pokémon\'s attacks does 30 more damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Scratch',
                cost: [F],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.name = 'Drilbur';
        this.fullName = 'Drilbur EPO';
        this.HONE_CLAWS_MARKER = 'HONE_CLAWS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.HONE_CLAWS_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            if (effect.player.active.marker.hasMarker(this.HONE_CLAWS_MARKER, this) && effect.attack !== this.attacks[0]) {
                effect.damage += 30;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.removeMarker(this.HONE_CLAWS_MARKER, this);
        }
        return state;
    }
}
exports.Drilbur = Drilbur;
