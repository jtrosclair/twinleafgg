"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heatmor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Heatmor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Lick',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Incinerate',
                cost: [R, C],
                damage: 30,
                text: 'Before doing damage, discard a Pokémon Tool card attached to the Defending Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Heatmor';
        this.fullName = 'Heatmor NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's active has a tool attached
            if (opponent.active.tools.length > 0) {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        opponent.active.moveCardsTo(cards, opponent.discard);
                    }
                });
            }
        }
        return state;
    }
}
exports.Heatmor = Heatmor;
