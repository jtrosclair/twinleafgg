"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquaTechnicalMachine01 = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TeamAquaTechnicalMachine01 extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TECHNICAL_MACHINE];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Team Aqua Technical Machine 01';
        this.fullName = 'Team Aqua Technichal Machine 01 MA';
        this.attacks = [{
                name: 'Miracle',
                cost: [C],
                damage: 10,
                text: 'Choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
            }];
        this.text = 'Attach this card to 1 of your Pokémon that has Team Aqua in its name. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Team Aqua Technical Machine 01.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            // Find slots to attach TM
            const blocked = [];
            let eligibleCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (!card.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
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
                    if (!!attachedTo && !attachedTo.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
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
            const options = [
                { message: game_1.GameMessage.SPECIAL_CONDITION_PARALYZED, value: card_types_1.SpecialCondition.PARALYZED },
                { message: game_1.GameMessage.SPECIAL_CONDITION_CONFUSED, value: card_types_1.SpecialCondition.CONFUSED },
                { message: game_1.GameMessage.SPECIAL_CONDITION_ASLEEP, value: card_types_1.SpecialCondition.ASLEEP },
                { message: game_1.GameMessage.SPECIAL_CONDITION_POISONED, value: card_types_1.SpecialCondition.POISONED },
                { message: game_1.GameMessage.SPECIAL_CONDITION_BURNED, value: card_types_1.SpecialCondition.BURNED }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_SPECIAL_CONDITION, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (option !== undefined) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [option.value]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.TeamAquaTechnicalMachine01 = TeamAquaTechnicalMachine01;
