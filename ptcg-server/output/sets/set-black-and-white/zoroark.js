"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useNastyPlot(next, store, state, effect, self) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    state = (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: self, sourceEffect: self.attacks[0] });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Zoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nasty Plot',
                cost: [D],
                damage: 0,
                text: 'Search your deck for a card and put it into your hand. ' +
                    'Shuffle your deck afterward.'
            }, {
                name: 'Foul Play',
                cost: [C, C],
                damage: 0,
                copycatAttack: true,
                text: 'Choose 1 of the Defending Pokemon\'s attacks and use it ' +
                    'as this attack.'
            }];
        this.set = 'BLW';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useNastyPlot(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.COPY_OPPONENT_ACTIVE_ATTACK)(store, state, effect);
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
