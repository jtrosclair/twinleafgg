"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallade = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gallade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Premonition',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may look at the top 5 cards of your deck and put them back on top of your deck in any order.'
            }];
        this.attacks = [{
                name: 'Sensitive Blade',
                cost: [C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If you played a Supporter card from your hand during this turn, this attack does 70 more damage.'
            }];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Gallade';
        this.fullName = 'Gallade BKT';
        this.PREMONITION_MARKER = 'PREMONITION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.PREMONITION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.ADD_MARKER(this.PREMONITION_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.PREMONITION_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Gallade = Gallade;
