"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarbodorVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
class GarbodorVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Garbodor V';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 2 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Rubbish Collecting',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokémon may have up to 2 Pokémon Tools attached to it. If it loses this Ability, discard Pokémon Tools from it until only 1 remains.'
            }];
        this.attacks = [{
                name: 'G-Max Malodor',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, that Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.setNumber = '101';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garbodor VMAX';
        this.fullName = 'Garbodor VMAX EVS';
        this.maxTools = 2;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.GarbodorVMAX = GarbodorVMAX;
