"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leavanny = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Leavanny extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Swadloon';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Nurturing',
                cost: [C],
                damage: 0,
                text: 'Choose 1 of your Pokémon. Search your deck for a card that evolves from that Pokémon and put it onto that Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward.'
            },
            {
                name: 'X-Scissor',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 50 more damage.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Leavanny';
        this.fullName = 'Leavanny EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const targetSlot = targets[0];
                    const targetCard = targetSlot.getPokemonCard();
                    if (targetCard) {
                        const evolvesFromName = targetCard.name;
                        // Build blocked list - block cards that don't evolve from the target
                        const blocked = [];
                        player.deck.cards.forEach((card, index) => {
                            if (!(card instanceof pokemon_card_1.PokemonCard) || card.evolvesFrom !== evolvesFromName) {
                                blocked.push(index);
                            }
                        });
                        // Search for evolution card
                        return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true, blocked }), cards => {
                            if (cards && cards.length > 0) {
                                const evolutionCard = cards[0];
                                player.deck.moveCardTo(evolutionCard, targetSlot);
                                targetSlot.pokemonPlayedTurn = state.turn;
                            }
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        });
                    }
                    else {
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    }
                }
                else {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 50;
                }
            });
        }
        return state;
    }
}
exports.Leavanny = Leavanny;
