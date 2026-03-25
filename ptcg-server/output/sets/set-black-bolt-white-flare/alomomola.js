"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alomomola = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Alomomola extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Gentle Fins',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may put a Basic Pokémon with 70HP or less from your discard pile onto your bench.'
            }];
        this.attacks = [{
                name: 'Waterfall',
                cost: [W, C, C],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Alomomola';
        this.fullName = 'Alomomola SV11B';
        this.GENTLE_FINS_MARKER = 'GENTLE_FINS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.GENTLE_FINS_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.GENTLE_FINS_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.marker.hasMarker(this.GENTLE_FINS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (openSlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked = player.discard.cards.reduce((acc, c, index) => {
                if (!(c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC && c.hp <= 70)) {
                    acc.push(index);
                }
                return acc;
            }, []);
            const maxPokemons = Math.min(openSlots.length, 1);
            effect.preventDefault = true;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: maxPokemons, allowCancel: false, blocked, maxPokemons }), selectedCards => {
                const cards = selectedCards || [];
                player.marker.addMarker(this.GENTLE_FINS_MARKER, this);
                cards.forEach((card, index) => {
                    player.discard.moveCardTo(card, openSlots[index]);
                    openSlots[index].pokemonPlayedTurn = state.turn;
                    store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
                });
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                return state;
            });
        }
        return state;
    }
}
exports.Alomomola = Alomomola;
