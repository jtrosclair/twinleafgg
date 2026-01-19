"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuzzlordGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GuzzlordGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.tags = [card_types_1.CardTag.ULTRA_BEAST, card_types_1.CardTag.POKEMON_GX];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Eat Sloppily',
                cost: [D],
                damage: 0,
                text: 'Discard the top 5 cards of your deck. If any of those cards are Energy cards, attach them to this Pokémon.'
            },
            {
                name: 'Tyrannical Hole',
                cost: [D, D, D, C, C],
                damage: 180,
                text: ''
            },
            {
                name: 'Glutton-GX',
                cost: [D, D, D, D, D],
                damage: 100,
                text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 2 more Prize cards. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Guzzlord-GX';
        this.fullName = 'Guzzlord-GX CIN';
        this.usedGluttonGX = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 5);
            const energyCards = temp.cards.filter(c => c instanceof game_1.EnergyCard);
            temp.moveCardsTo(energyCards, player.active);
            temp.moveTo(player.discard);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            this.usedGluttonGX = true;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Guzzy wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Red Banquet"
            if (this.usedGluttonGX === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 2;
                }
                this.usedGluttonGX = false;
            }
            return state;
        }
        return state;
    }
}
exports.GuzzlordGX = GuzzlordGX;
