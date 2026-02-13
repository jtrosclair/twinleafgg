"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandyShocksex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SandyShocksex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.cardType = F;
        this.hp = 220;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Magnetic Absorption',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if your opponent has 4 or fewer Prize cards remaining, you may attach a Basic [F] Energy card from your discard pile to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Earthen Spike',
                cost: [F, F, C],
                damage: 200,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.setNumber = '108';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sandy Shocks ex';
        this.fullName = 'Sandy Shocks ex PAR';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.MAGNETIC_ABSORPTION_MARKER = 'MAGNETIC_ABSORPTION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MAGNETIC_ABSORPTION_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.MAGNETIC_ABSORPTION_MARKER, this)) {
            effect.player.marker.removeMarker(this.MAGNETIC_ABSORPTION_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizes = opponent.getPrizeLeft();
            if (player.marker.hasMarker(this.MAGNETIC_ABSORPTION_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (prizes > 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const fightingEnergy = player.discard.cards.find(c => {
                return c instanceof game_1.EnergyCard && c.name == 'Fighting Energy';
            });
            if (!fightingEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            player.discard.moveCardTo(fightingEnergy, cardList);
            player.marker.addMarker(this.MAGNETIC_ABSORPTION_MARKER, this);
            return state;
        }
        return state;
    }
}
exports.SandyShocksex = SandyShocksex;
