"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryogonal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Cryogonal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Call Sign',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Water Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Cryofreeze',
                cost: [W],
                damage: 10,
                text: 'Discard an Energy attached to this Pokémon. The Defending Pokémon can\'t attack during your opponent\'s next turn.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cryogonal';
        this.fullName = 'Cryogonal PLF';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'CRYOGONAL_DEFENDING_CANNOT_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Call Sign - search deck for a Water Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {
                cardType: card_types_1.CardType.WATER
            });
        }
        // Attack 2: Cryofreeze
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard an energy from this Pokemon
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
            // Defending Pokemon can't attack during opponent's next turn
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        // Block attacks when marker is present
        if (effect instanceof game_effects_1.UseAttackEffect
            && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        // Clean up marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        return state;
    }
}
exports.Cryogonal = Cryogonal;
