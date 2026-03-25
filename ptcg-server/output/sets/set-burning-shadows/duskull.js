"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useKingsOrder(next, store, state, effect, self) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const hasBasicInDiscard = player.hand.cards.some(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC;
    });
    if (!hasBasicInDiscard) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, slots[index], { cards: [card], sourceCard: self });
        slots[index].pokemonPlayedTurn = state.turn;
    });
}
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dark Guidance',
                cost: [P],
                damage: 0,
                text: 'Put a Basic Pokémon from your discard pile onto your Bench.'
            },
            {
                name: 'Spooky Shot',
                cost: [P, C],
                damage: 20,
                text: ''
            }];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Duskull';
        this.fullName = 'Duskull BUS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useKingsOrder(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.Duskull = Duskull;
