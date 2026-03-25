"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zweilous2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Zweilous2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deino';
        this.cardType = N;
        this.hp = 90;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Draw In',
                cost: [C],
                damage: 0,
                text: 'Attach 2 [D] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Dragon Headbutt',
                cost: [P, D, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DRX';
        this.setNumber = '96';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zweilous';
        this.fullName = 'Zweilous DRX 96';
    }
    reduceEffect(store, state, effect) {
        // Draw In - attach 2 Dark Energy from discard to this Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const darkEnergyInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY
                && c.energyType === card_types_1.EnergyType.BASIC
                && c.provides.includes(card_types_1.CardType.DARK));
            if (darkEnergyInDiscard.length === 0) {
                return state;
            }
            const count = Math.min(2, darkEnergyInDiscard.length);
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (!(card instanceof game_1.EnergyCard)
                    || card.energyType !== card_types_1.EnergyType.BASIC
                    || !card.provides.includes(card_types_1.CardType.DARK)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: count, max: count, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                cards.forEach(card => {
                    player.discard.moveCardTo(card, player.active);
                });
            });
        }
        return state;
    }
}
exports.Zweilous2 = Zweilous2;
