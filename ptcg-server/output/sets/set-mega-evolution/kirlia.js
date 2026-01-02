"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
function* useCallSign(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call Sign',
                cost: [P],
                damage: 0,
                text: 'Search your deck for up to 3 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Psyshot',
                cost: [P],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '59';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia M1S';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCallSign(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Kirlia = Kirlia;
