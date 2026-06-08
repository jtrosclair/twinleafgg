"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phantump = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Phantump extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Envious Evolution',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put a card from your hand that evolves from this Pokemon onto it to evolve it. Then, put 2 damage counters on this Pokemon. You can\'t use this Ability during your first turn.'
            }];
        this.attacks = [{
                name: 'Mumble',
                cost: [P],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.usSetNumber = 'POR 38';
        this.name = 'Phantump';
        this.fullName = 'Phantump M4';
        this.ENVIOUS_EVOLUTION_MARKER = 'ENVIOUS_EVOLUTION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (state.turn <= 2) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!cardList)
                return state;
            const evolutionInHand = player.hand.cards.filter(c => c instanceof pokemon_card_1.PokemonCard && c.evolvesFrom === 'Phantump');
            if (evolutionInHand.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (!(card instanceof pokemon_card_1.PokemonCard) || card.evolvesFrom !== 'Phantump') {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true, blocked }), cards => {
                const selected = cards || [];
                if (selected.length === 0)
                    return state;
                (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.ENVIOUS_EVOLUTION_MARKER, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                const evolutionCard = selected[0];
                player.hand.moveCardTo(evolutionCard, cardList);
                cardList.clearEffects();
                cardList.pokemonPlayedTurn = state.turn;
                const placeDamage = new game_effects_1.PlaceDamageCountersEffect(player, cardList, 20, this);
                store.reduceEffect(state, placeDamage);
                return state;
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ENVIOUS_EVOLUTION_MARKER, this);
        return state;
    }
}
exports.Phantump = Phantump;
