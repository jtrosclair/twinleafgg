"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Unlimited Disposal',
                cost: [P],
                damage: 0,
                text: 'You may discard as many cards from your hand as you like.',
            },
            {
                name: 'Headbutt',
                cost: [C, C],
                damage: 20,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '28';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const self = this;
            const attackEffect = effect;
            const player = attackEffect.player;
            function* useUnlimitedDisposal(next) {
                const max = player.hand.cards.length;
                if (max === 0) {
                    return state;
                }
                yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ANY }, { min: 0, max, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: self, sourceEffect: attackEffect });
                    }
                    next();
                });
                return state;
            }
            const generator = useUnlimitedDisposal(() => generator.next());
            return generator.next().value;
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
