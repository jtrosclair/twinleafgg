"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwoopTeleporter = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SwoopTeleporter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ROCKETS_SECRET_MACHINE];
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Swoop! Teleporter';
        this.fullName = 'Swoop! Teleporter TRR';
        this.text = 'Search your deck for a Basic Pokémon (excluding Pokémon-ex) and switch it with 1 of your Basic Pokémon (excluding Pokémon-ex) in play. (Any cards attached to that Pokémon, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) Place the first Basic Pokémon in the discard pile. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.stage !== card_types_1.Stage.BASIC || card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                const target = results || [];
                if (target.length === 0) {
                    return state;
                }
                const blocked = [];
                player.deck.cards.forEach((c, index) => {
                    if (c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                        blocked.push(index);
                    }
                });
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARDS, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
                    cards = selectedCards || [];
                    if (cards.length === 0) {
                        return state;
                    }
                    // Discard the pokemon
                    target[0].cards.forEach(c => {
                        if (c instanceof game_1.PokemonCard && !target[0].energies.cards.includes(c)) {
                            (0, prefabs_1.MOVE_CARD_TO)(state, c, player.discard);
                        }
                    });
                    // Move the selected card to the bench slot
                    cards.forEach((card, index) => {
                        (0, prefabs_1.MOVE_CARD_TO)(state, card, target[0]);
                    });
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_SWITCHES_POKEMON_WITH_POKEMON_FROM_DECK, { name: player.name, card: target[0].getPokemonCard().name, secondCard: cards[0].name });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                });
            });
        }
        return state;
    }
}
exports.SwoopTeleporter = SwoopTeleporter;
