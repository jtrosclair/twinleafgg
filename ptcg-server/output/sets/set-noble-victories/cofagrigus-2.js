"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Cofagrigus2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Chuck into the Chest',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may choose a Pokémon from your Bench (excluding any Cofagrigus) and put it on top of your face-down Prize cards. If you do, put 1 of your face-down Prize cards onto your Bench. (You can\'t use this Ability if your Bench is full.) This ends your turn.'
            }];
        this.attacks = [{
                name: 'Hex',
                cost: [P, C],
                damage: 0,
                text: 'Put 4 damage counters on the Defending Pokémon.'
            }];
        this.set = 'NVI';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus NVI 47';
    }
    reduceEffect(store, state, effect) {
        // Chuck into the Chest
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check for available bench slot
            const hasEmptyBenchSlot = player.bench.some(b => b.cards.length === 0);
            if (!hasEmptyBenchSlot) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check for eligible benched Pokémon (not Cofagrigus)
            const eligibleBench = player.bench.filter(b => {
                var _a;
                return b.cards.length > 0 &&
                    ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Cofagrigus';
            });
            if (eligibleBench.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check for face-down prize cards
            const faceDownPrizes = player.prizes.filter(p => p.cards.length > 0);
            if (faceDownPrizes.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Choose a benched Pokémon
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: true }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const benchSlot = targets[0];
                const pokemonCard = benchSlot.getPokemonCard();
                if (!pokemonCard || pokemonCard.name === 'Cofagrigus') {
                    return;
                }
                // Move bench Pokémon to prizes (on top)
                const cardsToMove = benchSlot.cards.slice();
                // Find an empty prize slot or use the first one
                const targetPrize = player.prizes.find(p => p.cards.length === 0) || player.prizes[0];
                // Actually, we need to place the pokemon on TOP of prize cards
                // Move all cards from bench to a prize pile
                cardsToMove.forEach(card => {
                    benchSlot.moveCardTo(card, targetPrize);
                });
                benchSlot.clearEffects();
                targetPrize.isSecret = true;
                // Take a random prize card and put it on bench
                const availablePrizes = player.prizes.filter(p => p.cards.length > 0 && p !== targetPrize);
                if (availablePrizes.length === 0) {
                    state.phase = game_1.GamePhase.BETWEEN_TURNS;
                    return;
                }
                const randomPrizeIndex = Math.floor(Math.random() * availablePrizes.length);
                const chosenPrize = availablePrizes[randomPrizeIndex];
                // Find empty bench slot
                const emptyBench = player.bench.find(b => b.cards.length === 0);
                if (emptyBench && chosenPrize.cards.length > 0) {
                    const prizeCard = chosenPrize.cards[0];
                    if (prizeCard.superType === card_types_1.SuperType.POKEMON) {
                        chosenPrize.moveCardTo(prizeCard, emptyBench);
                        emptyBench.pokemonPlayedTurn = state.turn;
                    }
                    else {
                        // If it's not a Pokémon, put it in hand instead
                        chosenPrize.moveTo(player.hand);
                    }
                }
                // End turn
                state.phase = game_1.GamePhase.BETWEEN_TURNS;
            });
        }
        // Hex - put 4 damage counters
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.damage += 40;
        }
        return state;
    }
}
exports.Cofagrigus2 = Cofagrigus2;
