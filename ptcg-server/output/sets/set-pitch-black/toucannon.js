"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toucannon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Toucannon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Trumbeak';
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Sky Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may draw a card.',
            },];
        this.attacks = [{
                name: 'Feather Rondo',
                cost: [C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Benched Pokémon in play (both yours and your opponent\'s).',
            }];
        this.set = 'M5';
        this.setNumber = '66';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Toucannon';
        this.fullName = 'Toucannon M5';
        this.SKY_DRAW_MARKER = 'M5_TOUCANNON_SKYDRAW';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-sword-and-shield/cinccino.ts (marker once per turn)
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.SKY_DRAW_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (player.marker.hasMarker(this.SKY_DRAW_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.SKY_DRAW_MARKER, this);
            (0, prefabs_1.DRAW_CARDS)(player, 1);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let benches = player.bench.filter(b => b.cards.length > 0).length;
            benches += opponent.bench.filter(b => b.cards.length > 0).length;
            effect.damage += 20 * benches;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SKY_DRAW_MARKER, this)) {
            effect.player.marker.removeMarker(this.SKY_DRAW_MARKER, this);
        }
        return state;
    }
}
exports.Toucannon = Toucannon;
