"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volcarona = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Energy type constants (R, C, W) are assumed to be globally available as in Larvesta
class Volcarona extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvesta';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Heat Wave Scales',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may discard a Basic [R] Energy card from your hand in order to leave your opponent\'s Active Pokémon Burned.'
            }];
        this.attacks = [{
                name: 'Fire Wing',
                cost: [R, C, C],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Volcarona';
        this.fullName = 'Volcarona SV11B';
        this.HEAT_WAVE_SCALES_MARKER = 'HEAT_WAVE_SCALES_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.HEAT_WAVE_SCALES_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.HEAT_WAVE_SCALES_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.HEAT_WAVE_SCALES_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.FIRE);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.HEAT_WAVE_SCALES_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, name: 'Fire Energy' }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.HEAT_WAVE_SCALES_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
                (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            });
            return state;
        }
        return state;
    }
}
exports.Volcarona = Volcarona;
