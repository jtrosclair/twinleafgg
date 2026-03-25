"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowHandExtension = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const select_option_prompt_1 = require("../../game/store/prompts/select-option-prompt");
const check_effects_1 = require("../../game/store/effects/check-effects");
class PowHandExtension extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ROCKETS_SECRET_MACHINE];
        this.set = 'TRR';
        this.name = 'Pow! Hand Extension';
        this.fullName = 'Pow! Hand Extension TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.text = `You may use this card only if you have more Prize cards left than your opponent.
Move 1 Energy card attached to the Defending Pokémon to another of your opponent's Pokémon. Or, switch 1 of your opponent's Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blockedFrom = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList !== opponent.active) {
                    blockedFrom.push(target);
                }
            });
            const options = [
                {
                    message: game_1.GameMessage.MOVE_ENERGY_CARDS,
                    action: () => {
                        const blockedMap = [];
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                            store.reduceEffect(state, checkProvidedEnergy);
                            const blockedCards = [];
                            checkProvidedEnergy.energyMap.forEach(em => {
                                if (em.provides.length === 0) {
                                    blockedCards.push(em.card);
                                }
                            });
                            const blocked = [];
                            blockedCards.forEach(bc => {
                                const index = cardList.cards.indexOf(bc);
                                if (index !== -1 && !blocked.includes(index)) {
                                    blocked.push(index);
                                }
                            });
                            if (blocked.length !== 0) {
                                blockedMap.push({ source: target, blocked });
                            }
                        });
                        store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], {}, { min: 1, max: 1, allowCancel: false, blockedMap, blockedFrom }), transfers => {
                            if (transfers === null) {
                                return;
                            }
                            for (const transfer of transfers) {
                                const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                source.moveCardTo(transfer.card, target);
                            }
                        });
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH,
                    action: () => {
                        player.hand.moveCardTo(effect.trainerCard, player.supporter);
                        // We will discard this card after prompt confirmation
                        effect.preventDefault = true;
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                            const cardList = result[0];
                            if (cardList) {
                                const targetCard = new play_card_effects_1.TrainerTargetEffect(player, effect.trainerCard, cardList);
                                targetCard.target = cardList;
                                store.reduceEffect(state, targetCard);
                                if (targetCard.target) {
                                    opponent.switchPokemon(targetCard.target);
                                }
                            }
                            return state;
                        });
                    }
                }
            ];
            return store.prompt(state, new select_option_prompt_1.SelectOptionPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
                return state;
            });
        }
        return state;
    }
}
exports.PowHandExtension = PowHandExtension;
