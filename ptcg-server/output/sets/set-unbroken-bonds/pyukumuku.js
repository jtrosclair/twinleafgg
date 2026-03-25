"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyukumuku = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 2);
    if (max === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
function* useSurpriseFist(next, store, state, effect) {
    const player = effect.player;
    const opponent = effect.opponent;
    // Set base damage
    effect.damage = 60;
    // Create RPS choices
    const choices = [
        game_1.GameMessage.ROCK,
        game_1.GameMessage.PAPER,
        game_1.GameMessage.SCISSORS
    ];
    let playerChoice = 0;
    let opponentChoice = 0;
    // Player chooses Rock, Paper, or Scissors
    yield store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.ROCK_PAPER_SCISSORS, choices, { allowCancel: false }), choice => {
        playerChoice = choice;
        next();
    });
    // Opponent chooses Rock, Paper, or Scissors
    yield store.prompt(state, new game_1.SelectPrompt(opponent.id, game_1.GameMessage.ROCK_PAPER_SCISSORS, choices, { allowCancel: false }), choice => {
        opponentChoice = choice;
        next();
    });
    // Log both choices
    const choiceNames = ['Rock', 'Paper', 'Scissors'];
    store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: choiceNames[playerChoice] });
    store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: opponent.name, string: choiceNames[opponentChoice] });
    // Determine winner
    // 0 = Rock, 1 = Paper, 2 = Scissors
    // Rock beats Scissors, Scissors beats Paper, Paper beats Rock
    let playerWins = false;
    if (playerChoice === opponentChoice) {
        // Tie - no bonus damage
        playerWins = false;
    }
    else if ((playerChoice === 0 && opponentChoice === 2) || // Rock beats Scissors
        (playerChoice === 1 && opponentChoice === 0) || // Paper beats Rock
        (playerChoice === 2 && opponentChoice === 1) // Scissors beats Paper
    ) {
        playerWins = true;
    }
    // Apply bonus damage if player wins
    if (playerWins) {
        effect.damage = 120;
        store.log(state, game_1.GameLog.LOG_TEXT, { text: `${player.name} wins Rock-Paper-Scissors!` });
    }
    else {
        store.log(state, game_1.GameLog.LOG_TEXT, { text: `${player.name} did not win Rock-Paper-Scissors.` });
    }
    return state;
}
class Pyukumuku extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            }, {
                name: 'Surprise Fist',
                cost: [W, C, C],
                damage: 60,
                text: 'You and your opponent play Rock-Paper-Scissors. If you win, this attack does 60 more damage.'
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Pyukumuku';
        this.fullName = 'Pyukumuku UNB';
    }
    reduceEffect(store, state, effect) {
        // Call for Family attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Surprise Fist attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const generator = useSurpriseFist(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Pyukumuku = Pyukumuku;
