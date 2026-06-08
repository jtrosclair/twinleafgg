"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frogadier = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useCallingJutsu(next, store, state, effect) {
    const player = effect.player;
    const max = Math.min(3, player.deck.cards.filter(c => c.superType === card_types_1.SuperType.POKEMON).length);
    if (max === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach(c => player.deck.moveCardTo(c, player.hand));
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Frogadier extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Froakie';
        this.hp = 100;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Calling Jutsu',
                cost: [W],
                damage: 0,
                text: 'Search your deck for up to 3 Pokemon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Aqua Edge',
                cost: [W, W],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.usSetNumber = 'POR 21';
        this.name = 'Frogadier';
        this.fullName = 'Frogadier M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useCallingJutsu(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Frogadier = Frogadier;
