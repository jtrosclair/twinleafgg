"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dudunsparce = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dudunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dunsparce';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Run Away Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may draw 3 cards. If you drew any cards in this way, shuffle this Pokémon and all attached cards into your deck.'
            }];
        this.attacks = [
            {
                name: 'Land Crash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'Dudunsparce';
        this.fullName = 'Dudunsparce TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveTo(player.hand, 3);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    const pokemons = cardList.getPokemons();
                    const otherCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                        !pokemons.includes(card) &&
                        (!cardList.tools || !cardList.tools.includes(card)));
                    const tools = [...cardList.tools];
                    cardList.clearEffects();
                    // Move tools to the deck first
                    if (tools.length > 0) {
                        for (const tool of tools) {
                            cardList.moveCardTo(tool, player.deck);
                        }
                    }
                    // Move other cards (energies, etc.) to the deck second
                    if (otherCards.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.deck, { cards: otherCards });
                    }
                    // Move Pokémon cards to the deck last
                    if (pokemons.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.deck, { cards: pokemons });
                    }
                    cardList.clearEffects();
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Dudunsparce = Dudunsparce;
