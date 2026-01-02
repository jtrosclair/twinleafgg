"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmbreonV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class UmbreonV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.SINGLE_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 200;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Mean Look',
                cost: [D],
                damage: 30,
                text: 'During your opponent\'s next turn, the Defending Pokémon ' +
                    'can\'t retreat.'
            },
            {
                name: 'Moonlight Blade',
                cost: [D, C, C],
                damage: 80,
                text: 'If this Pokémon has any damage counters on it, this attack ' +
                    'does 80 more damage.'
            }];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.setNumber = '94';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon V';
        this.fullName = 'Umbreon V EVS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const source = player.active;
            // Check if source Pokemon has damage
            const damage = source.damage;
            if (damage > 0) {
                effect.damage += 80;
            }
            return state;
        }
        return state;
    }
}
exports.UmbreonV = UmbreonV;
