"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hydreigonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Greedy Eater',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from an attack this Pokémon uses, take 1 more Prize card.'
            }];
        this.attacks = [{
                name: 'Dark Bite',
                cost: [D, D, D, C, C],
                damage: 200,
                text: 'During your opponent\'s next turn, that Pokémon can\'t retreat.'
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Hydreigon ex';
        this.fullName = 'Hydreigon ex SV11W';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
            opponent.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_2.GameError(game_2.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            effect.player.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
            effect.player.forEachPokemon(game_2.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
                    cardList.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
                }
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.isStage(card_types_1.Stage.BASIC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only during attack phase, and only if Hydreigon ex is attacking
            if (state.phase !== game_1.GamePhase.ATTACK || opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.prizeCount > 0) {
                effect.prizeCount += 1;
            }
        }
        return state;
    }
}
exports.Hydreigonex = Hydreigonex;
