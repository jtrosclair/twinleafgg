"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skarmory = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skarmory extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Steel Cutter',
                cost: [M],
                damage: 0,
                damageCalculation: 'x',
                text: 'Discard up to 2 Basic [M] Energy from your hand. This attack does 40 damage times the number of Energy discarded in this way.',
            },];
        this.set = 'M5';
        this.setNumber = '58';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Skarmory';
        this.fullName = 'Skarmory M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-astral-radiance/kleavor.ts (discard energy from hand to boost damage pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Metal Energy' }, { min: 0, max: 2, allowCancel: false }), chosen => {
                const cards = chosen || [];
                if (cards.length > 0) {
                    player.hand.moveCardsTo(cards, player.discard);
                    effect.damage += 40 * cards.length;
                }
            });
        }
        return state;
    }
}
exports.Skarmory = Skarmory;
