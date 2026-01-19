"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryPlateDelta = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class MysteryPlateDelta extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TECHNICAL_MACHINE];
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Mystery Plate δ';
        this.fullName = 'Mystery Plate δ SK';
        this.attacks = [{
                name: 'Healing Oasis',
                cost: [C],
                damage: 0,
                text: 'If your opponent has 5 or more Prizes, search your deck for up to 3 basic Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward. If your opponent has exactly 2 Prizes, remove all damage counters from 1 of your Pokémon.'
            }];
        this.text = 'Attach this card to 1 of your Pokémon in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Mystery Plate δ.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), transfers => {
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
            const opponent = effect.opponent;
            if (opponent.getPrizeLeft() >= 5) {
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 3, allowCancel: false }), selected => {
                    if (selected) {
                        (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selected });
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    }
                });
            }
            else if (opponent.getPrizeLeft() === 2) {
                const blocked = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.damage === 0) {
                        blocked.push(target);
                    }
                });
                let targets = [];
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 0, max: 1, allowCancel: false, blocked }), results => {
                    targets = results || [];
                    if (targets.length === 0) {
                        return state;
                    }
                    targets.forEach(target => {
                        // Heal Pokemon
                        const healEffect = new game_effects_1.HealEffect(player, target, 999);
                        store.reduceEffect(state, healEffect);
                    });
                });
            }
        }
        return state;
    }
}
exports.MysteryPlateDelta = MysteryPlateDelta;
