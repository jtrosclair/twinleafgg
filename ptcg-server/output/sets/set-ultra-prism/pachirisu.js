"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pachirisu = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Pachirisu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Snuggly Generator',
                cost: [L],
                damage: 0,
                text: 'For each of your Benched Pokémon that has the Nuzzle attack, search your deck for a [L] Energy card and attach it to that Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Nuzzle',
                cost: [L],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pachirisu';
        this.fullName = 'Pachirisu UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Snuggly Generator
        // Ref: set-noble-victories/eelektrik.ts (Dynamotor - attach energy from deck)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Count benched Pokemon with Nuzzle attack
            let nuzzleCount = 0;
            const nuzzleTargets = [];
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const pokemonCard = benchSlot.getPokemonCard();
                    if (pokemonCard && pokemonCard.attacks.some(a => a.name === 'Nuzzle')) {
                        nuzzleCount++;
                        nuzzleTargets.push(benchSlot);
                    }
                }
            });
            if (nuzzleCount === 0 || player.deck.cards.length === 0) {
                return state;
            }
            // For each Nuzzle Pokemon, search deck for a [L] Energy and attach it
            const lightningInDeck = player.deck.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.LIGHTNING)).length;
            const maxAttach = Math.min(nuzzleCount, lightningInDeck);
            if (maxAttach === 0) {
                return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            }
            // Since we need to attach to specific Pokemon, use a loop
            // Search deck for up to nuzzleCount [L] Energy, then distribute
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.EnergyCard) || card.energyType !== card_types_1.EnergyType.BASIC || !card.provides.includes(card_types_1.CardType.LIGHTNING)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: maxAttach, allowCancel: false, blocked }), (selected) => {
                const cards = selected || [];
                // Attach one energy to each Nuzzle Pokemon
                for (let i = 0; i < cards.length && i < nuzzleTargets.length; i++) {
                    player.deck.moveCardTo(cards[i], nuzzleTargets[i]);
                }
                return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        // Attack 2: Nuzzle
        // Ref: AGENTS-patterns.md (coin flip + paralyzed)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Pachirisu = Pachirisu;
