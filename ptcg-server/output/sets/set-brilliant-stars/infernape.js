"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infernape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Infernape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = R;
        this.evolvesFrom = 'Monferno';
        this.hp = 150;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Infernal Vortex',
                cost: [R],
                damage: 80,
                damageCalculation: 'x',
                text: 'Reveal the top 5 cards of your deck. This attack does 80 damage for each Energy card you find there. Then, discard those Energy cards and shuffle the other cards back into your deck.'
            },
            {
                name: 'Burning Kick',
                cost: [R, C],
                damage: 160,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Infernape';
        this.fullName = 'Infernape BRS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            // Filter for item cards
            const energyCards = deckTop.cards.filter(c => c instanceof game_1.EnergyCard);
            if (energyCards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, energyCards), () => state);
            }
            if (energyCards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, energyCards), () => state);
            }
            // Move energy cards to discard
            deckTop.moveCardsTo(energyCards, player.discard);
            // Move all cards to discard
            deckTop.moveTo(player.deck, deckTop.cards.length);
            effect.damage = 80 * energyCards.length;
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.Infernape = Infernape;
