"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seadra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useCallForBackup(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        return state;
    }
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, player.hand);
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Seadra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Horsea';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Call for Backup',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Search your deck for up to 3 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Sharp Fin',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            },
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Seadra';
        this.fullName = 'Seadra SFA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useCallForBackup(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Seadra = Seadra;
