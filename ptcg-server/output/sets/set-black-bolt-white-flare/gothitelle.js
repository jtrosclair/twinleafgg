"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothitelle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothitelle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.evolvesFrom = 'Gothorita';
        this.powers = [{
                name: 'Distorted Future',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may have your opponent shuffle their hand into their deck and draw 3 cards.'
            }];
        this.attacks = [{
                name: 'Synchro Shot',
                cost: [P, C],
                damage: 90,
                damageCalculation: '+',
                text: 'If you have the same number of cards in your hand as your opponent, this attack does 90 more damage.'
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Gothitelle';
        this.fullName = 'Gothitelle WHT';
        this.DISTORTED_FUTURE_MARKER = 'DISTORTED_FUTURE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Can't use ability if already used
            if (player.marker.hasMarker(this.DISTORTED_FUTURE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.DISTORTED_FUTURE_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { sourceCard: this });
            (0, prefabs_1.DRAW_CARDS)(opponent, 3);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.DISTORTED_FUTURE_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DISTORTED_FUTURE_MARKER, this);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.hand.cards.length === opponent.hand.cards.length) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Gothitelle = Gothitelle;
