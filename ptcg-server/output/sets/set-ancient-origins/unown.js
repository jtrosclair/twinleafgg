"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unown = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Unown extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Farewell Letter',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is ' +
                    'on your Bench, you may discard this Pokemon and all cards attached ' +
                    'to it (this does not count as a Knock Out). If you do, draw a card.'
            }];
        this.attacks = [
            {
                name: 'Hidden Power',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Unown';
        this.fullName = 'Unown AOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // check if UnownR is on player's Bench
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const monCardList = player.bench[benchIndex];
            const pokemons = monCardList.getPokemons();
            const otherCards = monCardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !pokemons.includes(card) &&
                (!monCardList.tools || !monCardList.tools.includes(card)));
            const tools = [...monCardList.tools];
            // Move Pokémon cards to the discard
            if (pokemons.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.discard, { cards: pokemons });
            }
            // Move other cards (tools, energies, etc.) to the discard
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.discard, { cards: otherCards });
            }
            // Move tools to the discard
            if (tools.length > 0) {
                for (const tool of tools) {
                    cardList.moveCardTo(tool, player.discard);
                }
            }
            (0, prefabs_1.DRAW_CARDS)(player, 1);
            return state;
        }
        return state;
    }
}
exports.Unown = Unown;
