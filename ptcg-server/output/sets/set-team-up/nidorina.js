"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorina = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useFamilyRescue(next, store, state, effect) {
    const player = effect.player;
    const blocked = [];
    let psychicCount = 0;
    player.discard.cards.forEach((c, idx) => {
        if (c instanceof pokemon_card_1.PokemonCard && c.cardType === card_types_1.CardType.PSYCHIC) {
            psychicCount++;
        }
        else {
            blocked.push(idx);
        }
    });
    if (psychicCount === 0) {
        return state;
    }
    const max = Math.min(5, psychicCount);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_2.SuperType.POKEMON }, { min: 0, max, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    if (cards.length > 0) {
        yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
        });
    }
}
class Nidorina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nidoran F';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Family Rescue',
                cost: [C],
                damage: 0,
                text: 'Shuffle 5 [P] Pokémon from your discard pile into your deck.'
            },
            {
                name: 'Bite',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'TEU';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nidorina';
        this.fullName = 'Nidorina TEU';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useFamilyRescue(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Nidorina = Nidorina;
