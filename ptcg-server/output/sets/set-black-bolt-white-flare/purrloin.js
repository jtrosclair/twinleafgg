"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purrloin = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useInviteEvil(next, store, state, effect) {
    const player = effect.player;
    const opponent = effect.opponent;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { cardType: game_1.CardType.DARK }, { min: 0, max: 3, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Purrloin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Invite Evil',
                cost: [D],
                damage: 0,
                text: 'Search your deck for up to 3 {D} Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
        ];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Purrloin';
        this.fullName = 'Purrloin SV11W';
    }
    reduceEffect(store, state, effect) {
        // Invite Evil
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useInviteEvil(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Purrloin = Purrloin;
