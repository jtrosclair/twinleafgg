"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plusle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Plusle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: +10 }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Plus Charge',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if any of your Pokémon were Knocked Out during your opponent\'s last turn, you may search your discard pile for up to 2 basic Energy cards, show them to your opponent, and put them into your hand. You can\'t use more than 1 Plus Charge Poké-Power each turn. This power can\'t be used if Plusle is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Tag Play +',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'If you have Minun on your Bench, you may do 20 damage to any 1 Benched Pokémon instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'SW';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Plusle';
        this.fullName = 'Plusle SW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!(0, prefabs_1.HAS_MARKER)('OPPONENT_KNOCKOUT_MARKER', player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.usedPlusCharge == true) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Player has no Basic Energy in the discard pile
            let basicEnergyCards = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
                    basicEnergyCards++;
                }
            });
            if (basicEnergyCards === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.usedPlusCharge = true;
            (0, prefabs_1.ABILITY_USED)(player, this);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const min = Math.min(basicEnergyCards, 2);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: min, max: min, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.hand);
                    cards.forEach((card, index) => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (cards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                    }
                }
                if (cards.length > 0) {
                    // Recover discarded Energy
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                (0, prefabs_1.ADD_MARKER)('OPPONENT_KNOCKOUT_MARKER', player, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                (0, prefabs_1.REMOVE_MARKER)('OPPONENT_KNOCKOUT_MARKER', player, this);
            }
            player.usedPlusCharge = false;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let isMinunInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Minun') {
                    isMinunInPlay = true;
                }
            });
            if (isMinunInPlay) {
                const player = effect.player;
                const hasBench = player.bench.some(b => b.cards.length > 0);
                if (hasBench === false) {
                    return state;
                }
                // Set the damage to 0
                effect.damage = 0;
                // Prompt asking which Pokémon to attack
                // (user can choose opponent's Active)
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: false }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = targets[0];
                    store.reduceEffect(state, damageEffect);
                });
            }
            return state;
        }
        return state;
    }
}
exports.Plusle = Plusle;
