"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charcadet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charcadet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gather Power',
                cost: [R],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
            },
            {
                name: 'Chop',
                cost: [R],
                damage: 10,
                text: '',
            }];
        this.set = 'PFL';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Charcadet';
        this.fullName = 'Charcadet M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: this });
                }
            });
        }
        return state;
    }
}
exports.Charcadet = Charcadet;
