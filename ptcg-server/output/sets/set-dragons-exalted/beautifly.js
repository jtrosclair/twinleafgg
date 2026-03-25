"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beautifly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class Beautifly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Silcoon';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Triple Energy',
                cost: [G],
                damage: 0,
                text: 'Search your deck for 3 different types of basic Energy cards and attach them to your Pokémon in any way you like. Shuffle your deck afterward.'
            },
            {
                name: 'Drainpour',
                cost: [G, C, C],
                damage: 40,
                text: 'Heal 40 damage from each of your Benched Pokémon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beautifly';
        this.fullName = 'Beautifly DRX';
    }
    reduceEffect(store, state, effect) {
        // Triple Energy - search deck for 3 different types of basic Energy, attach to your Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            // Find available basic energy types in deck
            const basicEnergyInDeck = player.deck.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC);
            if (basicEnergyInDeck.length === 0) {
                return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            }
            // Get unique types available
            const typesAvailable = new Set();
            basicEnergyInDeck.forEach(c => {
                if (c.superType === card_types_1.SuperType.ENERGY) {
                    c.provides.forEach(t => typesAvailable.add(t));
                }
            });
            const maxCards = Math.min(3, typesAvailable.size);
            // Let player choose up to 3 basic energy cards of different types
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card.superType !== card_types_1.SuperType.ENERGY || card.energyType !== card_types_1.EnergyType.BASIC) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: maxCards, allowCancel: true, blocked }), selectedCards => {
                const cards = selectedCards || [];
                if (cards.length === 0) {
                    return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
                // Now attach each energy to a Pokemon of player's choice
                const attachNext = (index) => {
                    if (index >= cards.length) {
                        return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    }
                    const card = cards[index];
                    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            player.deck.moveCardTo(card, targets[0]);
                        }
                        return attachNext(index + 1);
                    });
                };
                return attachNext(0);
            });
        }
        // Drainpour - heal 40 from each Benched Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 40);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Beautifly = Beautifly;
