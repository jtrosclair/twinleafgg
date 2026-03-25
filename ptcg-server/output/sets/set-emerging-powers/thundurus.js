"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thundurus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Thundurus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Charge',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a [L] Energy card and attach it to this Pokémon. Shuffle your deck afterward.'
            },
            {
                name: 'Disaster Volt',
                cost: [L, L, C],
                damage: 80,
                text: 'Discard an Energy attached to this Pokémon.'
            }];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Thundurus';
        this.fullName = 'Thundurus EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 0, max: 1, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.active);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Thundurus = Thundurus;
