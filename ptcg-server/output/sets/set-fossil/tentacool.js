"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tentacool = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Tentacool extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [];
        this.powers = [{
                name: 'Cowardice',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'At any time during your turn (before your attack), you may return Tentacool to your hand. (Discard all cards attached to Tentacool.) This power can\'t be used the turn you put Tentacool into play or if Tentacool is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Acid',
                cost: [W],
                damage: 10,
                text: ''
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Tentacool';
        this.fullName = 'Tentacool FO';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);
            const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, cardList);
            store.reduceEffect(state, playedTurnEffect);
            if (playedTurnEffect.pokemonPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const pokemonCardList = cardList;
            const tentacoolCard = pokemonCardList.getPokemonCard();
            if (!tentacoolCard) {
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
                prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
            }
            // Move Pokémon to hand
            if (pokemons.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
            }
        }
        return state;
    }
}
exports.Tentacool = Tentacool;
