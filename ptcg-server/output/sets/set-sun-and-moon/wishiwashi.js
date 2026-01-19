"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishiwashi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Wishiwashi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Cowardice',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard all cards attached to this Pokémon and return it to your hand. You can\'t use this Ability during your first turn or on the turn this Pokémon was put into play.'
            }];
        this.attacks = [{
                name: 'Water Gun',
                cost: [W],
                damage: 10,
                text: ''
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Wishiwashi';
        this.fullName = 'Wishiwashi SUM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, cardList);
            store.reduceEffect(state, playedTurnEffect);
            if (playedTurnEffect.pokemonPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const pokemonCardList = cardList;
            const wishiwashiCard = pokemonCardList.getPokemonCard();
            if (!wishiwashiCard) {
                return state;
            }
            const pokemons = pokemonCardList.getPokemons();
            const otherCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !pokemons.includes(card) &&
                (!pokemonCardList.tools || !pokemonCardList.tools.includes(card)));
            const tools = [...pokemonCardList.tools];
            // Move tools to discard first
            if (tools.length > 0) {
                for (const tool of tools) {
                    pokemonCardList.moveCardTo(tool, player.discard);
                }
            }
            // Move other cards to discard
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.discard, { cards: otherCards });
            }
            // Move Pokémon to hand
            if (pokemons.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.hand, { cards: pokemons });
            }
        }
        return state;
    }
}
exports.Wishiwashi = Wishiwashi;
