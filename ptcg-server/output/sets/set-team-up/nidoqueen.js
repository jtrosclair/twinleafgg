"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoqueen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidoqueen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorina';
        this.cardType = P;
        this.hp = 160;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Queen\'s Call',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for a Pokémon that isn\'t a Pokémon-GX or Pokémon-EX, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Power Lariat',
                cost: [C, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Evolution Pokémon on your Bench.'
            }];
        this.set = 'TEU';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nidoqueen';
        this.fullName = 'Nidoqueen TEU';
    }
    reduceEffect(store, state, effect) {
        // Queen's Call Ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && (card.cardTag.includes(card_types_1.CardTag.POKEMON_GX) || card.cardTag.includes(card_types_1.CardTag.POKEMON_EX))) {
                    blocked.push(index);
                }
            });
            let chosen = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                chosen = selected || [];
                if (chosen.length > 0) {
                    player.deck.moveCardsTo(chosen, player.hand);
                    store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(state_utils_1.StateUtils.getOpponent(state, player).id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosen), () => { });
                }
                store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Power Lariat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let evoCount = 0;
            player.bench.forEach((slot) => {
                const poke = slot.getPokemonCard();
                if (poke && poke.stage !== card_types_1.Stage.BASIC) {
                    evoCount++;
                }
            });
            effect.damage += 50 * evoCount;
            return state;
        }
        return state;
    }
}
exports.Nidoqueen = Nidoqueen;
