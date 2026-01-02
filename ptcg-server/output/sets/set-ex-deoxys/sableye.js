"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sableye extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.resistance = [{ type: C, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Night Vision',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Sableye is your Active Pokémon, you may look at your opponent\'s hand. This power can\'t be used if Sableye is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Slash',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Limitation',
                cost: [D],
                damage: 0,
                text: 'Your opponent can\'t play any Supporter Cards from his or hand during your opponent\'s next turn.'
            }];
        this.set = 'DX';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sableye';
        this.fullName = 'Sableye DX';
        this.NIGHT_VISION_MARKER = 'NIGHT_VISION_MARKER';
        this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.NIGHT_VISION_MARKER, player, this);
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.NIGHT_VISION_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.NIGHT_VISION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
            prefabs_1.ADD_MARKER(this.NIGHT_VISION_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, opponent, this);
        }
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            prefabs_1.REMOVE_MARKER(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.Sableye = Sableye;
