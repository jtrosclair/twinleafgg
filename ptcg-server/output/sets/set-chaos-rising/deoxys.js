"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deoxys = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
class Deoxys extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Genome Charge',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic [P] Energy cards and attach them to this Pokemon. Then, shuffle your deck.'
            },
            {
                name: 'Psychic',
                cost: [P, P, C],
                damage: 80,
                text: 'This attack does 20 more damage for each Energy attached to your opponent\'s Active Pokemon.'
            }
        ];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.usSetNumber = 'POR 31';
        this.name = 'Deoxys';
        this.fullName = 'Deoxys M4';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Genome Charge
        // Ref: set-sword-and-shield/pikachu.ts (ChooseCardsPrompt from deck for energy, attach, shuffle)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (!(c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(P))) {
                    blocked.push(index);
                }
            });
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false, blocked }), (cards) => {
                cards = cards || [];
                if (cards.length > 0) {
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    if (cardList) {
                        player.deck.moveCardsTo(cards, cardList);
                    }
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        // Attack 2: Psychic
        // Ref: set-burning-shadows/shiinotic.ts (CheckProvidedEnergyEffect on opponent)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            store.reduceEffect(state, checkEnergy);
            const energyCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
            effect.damage += 20 * energyCount;
        }
        return state;
    }
}
exports.Deoxys = Deoxys;
