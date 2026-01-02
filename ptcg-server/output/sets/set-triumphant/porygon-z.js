"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PorygonZ = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PorygonZ extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Porygon2';
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Dimensional Transfer',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your discard pile for a Trainer card, show it to your opponent, and put it on top of your deck. This power can\'t be used if Porygon-Z is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Suspicious Beam Beta',
                cost: [C, C, C],
                damage: 80,
                text: 'If Porygon-Z has no Rainbow Energy attached to it, Porygon-Z does 20 damage to itself and Porygon-Z is now Confused.'
            }];
        this.set = 'TM';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Porygon-Z';
        this.fullName = 'Porygon-Z TM';
        this.DIMENASIONAL_TRANSFER_MARKER = 'DIMENASIONAL_TRANSFER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (!(player.discard.cards.some(card => card instanceof game_1.TrainerCard
                && card.trainerType === card_types_1.TrainerType.ITEM))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.HAS_MARKER(this.DIMENASIONAL_TRANSFER_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    const deckTop = new game_1.CardList();
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        if (cards.length > 0) {
                            cards.forEach(card => {
                                prefabs_1.MOVE_CARD_TO(state, card, deckTop);
                            });
                            return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                                if (order === null) {
                                    return state;
                                }
                                deckTop.applyOrder(order);
                                deckTop.moveToTopOfDestination(player.deck);
                                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                            });
                        }
                        return state;
                    });
                }
            });
            prefabs_1.ABILITY_USED(player, this);
            prefabs_1.ADD_MARKER(this.DIMENASIONAL_TRANSFER_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DIMENASIONAL_TRANSFER_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasRainbowEnergy = player.active.cards.some(card => card.name === 'Rainbow Energy');
            if (hasRainbowEnergy) {
                return state;
            }
            else {
                prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
                prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
            }
        }
        return state;
    }
}
exports.PorygonZ = PorygonZ;
