"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Crobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Golbat';
        this.hp = 130;
        this.cardType = D;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Nighttime Maneuvers',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokemon is in the Active Spot, you may use this Ability. Search your deck for a card. Shuffle your deck, then put that card on top of it.'
            }];
        this.attacks = [{
                name: 'Poison Sound Wave',
                cost: [D],
                damage: 80,
                text: 'Your opponent\'s Active Pokemon is now Confused and Poisoned.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.usSetNumber = 'CRI 51';
        this.name = 'Crobat';
        this.fullName = 'Crobat M4';
        this.NIGHTTIME_MANEUVERS_MARKER = 'NIGHTTIME_MANEUVERS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.NIGHTTIME_MANEUVERS_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length === 0)
                    return state;
                const deckTop = new card_list_1.CardList();
                player.deck.moveCardsTo(cards, deckTop);
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    if (order === null)
                        return state;
                    deckTop.applyOrder(order);
                    deckTop.moveToTopOfDestination(player.deck);
                    return state;
                });
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.NIGHTTIME_MANEUVERS_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED, card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Crobat = Crobat;
