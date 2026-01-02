"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownE = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class UnownE extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Shuffle',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for another Unown and switch it with Unown. (Any cards attached to Unown, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Unown on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Shuffle Poké-Power each turn.'
            }];
        this.attacks = [{
                name: 'Hidden Power',
                cost: [C],
                damage: 0,
                text: 'If your opponent\'s Bench isn\'t full, look at his or her hand. Choose 1 Basic Pokémon you find there and put it onto your opponent\'s Bench. Then, switch it with the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'E';
        this.name = 'Unown';
        this.fullName = 'Unown UF';
        this.SHUFFLE_MARKER = 'SHUFFLE_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHUFFLE_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const targetCardList = game_1.StateUtils.findCardList(state, this);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
            }
            if (prefabs_1.HAS_MARKER(this.SHUFFLE_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name !== 'Unown') {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), (selection) => {
                if (selection.length <= 0) {
                    return state;
                }
                const pokemonCard = selection[0];
                if (!(pokemonCard instanceof pokemon_card_1.PokemonCard)) {
                    return state;
                }
                store.log(state, game_1.GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
                    name: player.name,
                    pokemon: this.name,
                    card: pokemonCard.name,
                    effect: effect.power.name,
                });
                player.deck.moveCardTo(pokemonCard, targetCardList);
                targetCardList.moveCardTo(this, player.deck);
                prefabs_1.SHUFFLE_DECK(store, state, player);
                prefabs_1.ADD_MARKER(this.SHUFFLE_MARKER, player, this);
            });
        }
        // Hidden Power
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                // No open slots, return state
                return state;
            }
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH, opponent.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: true }), selected => {
                const cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                cards.forEach((card, index) => {
                    opponent.hand.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                    opponent.switchPokemon(slots[index]);
                });
            });
        }
        return state;
    }
}
exports.UnownE = UnownE;
