"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientTechnicalMachineRock = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AncientTechnicalMachineRock extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TECHNICAL_MACHINE];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Ancient Technical Machine [Rock]';
        this.fullName = 'Ancient Technical Machine [Rock] HL';
        this.attacks = [{
                name: 'Stone Generator',
                cost: [C],
                damage: 0,
                text: 'If your opponent has any Evolved Pokémon in play, remove the highest Stage Evolution card from each of them and put those cards back into his or her hand.'
            }];
        this.text = 'Attach this card to 1 of your Evolved Pokémon (excluding Pokémon-ex and Pokémon that has an owner in its name) in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Ancient Technical Machine [Rock].';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            // Find slots to attach TM
            const blocked = [];
            let eligibleCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.getPokemons().length < 2 || card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked.push(index);
                }
                else {
                    eligibleCount++;
                }
            });
            // Error if no slots
            if (eligibleCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked }), transfers => {
                player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex) || cardList.getPokemons().length < 2)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const reduction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < reduction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && effect.player.active.cards.includes(this) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Look through all known cards to find out if Pokemon can evolve
            const cm = game_1.CardManager.getInstance();
            const evolutions = cm.getAllCards().filter(c => {
                return c instanceof game_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
            });
            // Build possible evolution card names
            const evolutionNames = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const valid = evolutions.filter(e => e.evolvesFrom === card.name);
                valid.forEach(c => {
                    if (!evolutionNames.includes(c.name)) {
                        evolutionNames.push(c.name);
                    }
                });
            });
            if (opponent.active.getPokemonCard()) {
                const activePokemon = opponent.active.cards.filter(card => card.superType === card_types_1.SuperType.POKEMON);
                if (activePokemon.length > 0) {
                    let lastPlayedPokemonIndex = activePokemon.length - 1;
                    while (lastPlayedPokemonIndex >= 0 && activePokemon[lastPlayedPokemonIndex] instanceof game_1.PokemonCard && activePokemon[lastPlayedPokemonIndex].stage === card_types_1.Stage.BASIC) {
                        lastPlayedPokemonIndex--;
                    }
                    if (lastPlayedPokemonIndex >= 0) {
                        const lastPlayedPokemon = activePokemon[lastPlayedPokemonIndex];
                        opponent.active.moveCardTo(lastPlayedPokemon, opponent.hand);
                    }
                }
            }
            opponent.bench.forEach(benchSpot => {
                if (benchSpot.getPokemonCard()) {
                    const benchPokemon = benchSpot.cards.filter(card => card.superType === card_types_1.SuperType.POKEMON);
                    if (benchPokemon.length > 0) {
                        let lastPlayedPokemonIndex = benchPokemon.length - 1;
                        while (lastPlayedPokemonIndex >= 0 && benchPokemon[lastPlayedPokemonIndex] instanceof game_1.PokemonCard && benchPokemon[lastPlayedPokemonIndex].stage === card_types_1.Stage.BASIC) {
                            lastPlayedPokemonIndex--;
                        }
                        if (lastPlayedPokemonIndex >= 0) {
                            const lastPlayedPokemon = benchPokemon[lastPlayedPokemonIndex];
                            benchSpot.moveCardTo(lastPlayedPokemon, opponent.hand);
                        }
                    }
                }
            });
        }
        return state;
    }
}
exports.AncientTechnicalMachineRock = AncientTechnicalMachineRock;
