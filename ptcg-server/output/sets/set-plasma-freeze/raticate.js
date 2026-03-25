"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raticate = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Raticate extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rattata';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Transfer Junk',
                cost: [C],
                damage: 0,
                text: 'Put a Team Plasma Pokémon, a Team Plasma Trainer card, and a Team Plasma Energy card from your discard pile into your hand.'
            },
            {
                name: 'Bite',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Raticate';
        this.fullName = 'Raticate PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Step 1: Choose a Team Plasma Pokemon from discard
            const plasmaPokemonBlocked = [];
            player.discard.cards.forEach((card, index) => {
                const isPlasmaPokemon = card instanceof pokemon_card_1.PokemonCard
                    && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA);
                if (!isPlasmaPokemon) {
                    plasmaPokemonBlocked.push(index);
                }
            });
            const hasPlasmaPokemon = plasmaPokemonBlocked.length < player.discard.cards.length;
            if (hasPlasmaPokemon) {
                store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true, blocked: plasmaPokemonBlocked }), selectedPokemon => {
                    const cardsToHand = selectedPokemon || [];
                    // Step 2: Choose a Team Plasma Trainer from discard
                    const plasmaTrainerBlocked = [];
                    player.discard.cards.forEach((card, index) => {
                        const isPlasmaTrainer = card instanceof game_1.TrainerCard
                            && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA);
                        if (!isPlasmaTrainer) {
                            plasmaTrainerBlocked.push(index);
                        }
                    });
                    const hasPlasmaTrainer = plasmaTrainerBlocked.length < player.discard.cards.length;
                    if (hasPlasmaTrainer) {
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: true, blocked: plasmaTrainerBlocked }), selectedTrainer => {
                            cardsToHand.push(...(selectedTrainer || []));
                            // Step 3: Choose a Team Plasma Energy from discard
                            const plasmaEnergyBlocked = [];
                            player.discard.cards.forEach((card, index) => {
                                const isPlasmaEnergy = card.superType === card_types_1.SuperType.ENERGY
                                    && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA);
                                if (!isPlasmaEnergy) {
                                    plasmaEnergyBlocked.push(index);
                                }
                            });
                            const hasPlasmaEnergy = plasmaEnergyBlocked.length < player.discard.cards.length;
                            if (hasPlasmaEnergy) {
                                store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true, blocked: plasmaEnergyBlocked }), selectedEnergy => {
                                    cardsToHand.push(...(selectedEnergy || []));
                                    if (cardsToHand.length > 0) {
                                        (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cardsToHand);
                                        player.discard.moveCardsTo(cardsToHand, player.hand);
                                    }
                                });
                            }
                            else {
                                if (cardsToHand.length > 0) {
                                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cardsToHand);
                                    player.discard.moveCardsTo(cardsToHand, player.hand);
                                }
                            }
                        });
                    }
                    else {
                        // Step 3 (no trainer): Choose a Team Plasma Energy from discard
                        const plasmaEnergyBlocked = [];
                        player.discard.cards.forEach((card, index) => {
                            const isPlasmaEnergy = card.superType === card_types_1.SuperType.ENERGY
                                && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA);
                            if (!isPlasmaEnergy) {
                                plasmaEnergyBlocked.push(index);
                            }
                        });
                        const hasPlasmaEnergy = plasmaEnergyBlocked.length < player.discard.cards.length;
                        if (hasPlasmaEnergy) {
                            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true, blocked: plasmaEnergyBlocked }), selectedEnergy => {
                                cardsToHand.push(...(selectedEnergy || []));
                                if (cardsToHand.length > 0) {
                                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cardsToHand);
                                    player.discard.moveCardsTo(cardsToHand, player.hand);
                                }
                            });
                        }
                        else {
                            if (cardsToHand.length > 0) {
                                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cardsToHand);
                                player.discard.moveCardsTo(cardsToHand, player.hand);
                            }
                        }
                    }
                });
            }
        }
        return state;
    }
}
exports.Raticate = Raticate;
