"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mewex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Restart',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may draw cards until you ' +
                    'have 3 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Genome Hacking',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                copycatAttack: true,
                text: 'Choose 1 of the Defending Pokemon\'s attacks and use it ' +
                    'as this attack.'
            }];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Mew ex';
        this.fullName = 'Mew ex MEW';
        this.RESTART_MARKER = 'RESTART_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.RESTART_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.RESTART_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.RESTART_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.hand.cards.length >= 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            while (player.hand.cards.length < 3) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
            player.marker.addMarker(this.RESTART_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                if (player instanceof Mewex) {
                    player.marker.removeMarker(this.RESTART_MARKER);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COPY_OPPONENT_ACTIVE_ATTACK)(store, state, effect);
        }
        return state;
    }
}
exports.Mewex = Mewex;
