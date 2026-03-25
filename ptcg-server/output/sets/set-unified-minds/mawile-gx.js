"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MawileGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MawileGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 170;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Captivating Wink',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may have your opponent reveal their hand and put any number of Basic Pokémon you find there onto their Bench.',
            }];
        this.attacks = [{
                name: 'Wily Bite',
                cost: [M, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
            }, {
                name: 'Big Eater-GX',
                cost: [M, C],
                damage: 0,
                gxAttack: true,
                text: 'Your opponent reveals their hand. Discard all Supporter cards you find there. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Mawile-GX';
        this.fullName = 'Mawile-GX UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    const slots = opponent.bench.filter(b => b.cards.length === 0);
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    if (slots.length === 0) {
                        // No open slots, do nothing
                        return state;
                    }
                    if (opponent.hand.cards.length === 0) {
                        return state;
                    }
                    const max = Math.min(opponent.hand.cards.filter(card => card instanceof pokemon_card_1.PokemonCard && card.stage === card_types_1.Stage.BASIC).length, slots.length);
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH, opponent.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: true }), selected => {
                        const cards = selected || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            return state;
                        }
                        cards.forEach((card, index) => {
                            opponent.hand.moveCardTo(card, slots[index]);
                            slots[index].pokemonPlayedTurn = state.turn;
                        });
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        // Wily Bite
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += (30 * opponentBench);
        }
        // Big Eater-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // set GX attack as used for game
            player.usedGX = true;
            // Create a copy of the opponent's hand to show before moving cards
            const opponentHandCopy = [...opponent.hand.cards];
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponentHandCopy);
            const supporterCards = opponent.hand.cards.filter(card => card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.discard, { cards: supporterCards, sourceCard: this, sourceEffect: this.attacks[1] });
        }
        return state;
    }
}
exports.MawileGX = MawileGX;
