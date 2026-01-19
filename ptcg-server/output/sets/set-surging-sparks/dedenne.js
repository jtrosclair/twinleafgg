"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dedenne = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dedenne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Electromagnetic Sonar',
                cost: [C],
                damage: 0,
                text: 'Put a Trainer card from your discard pile into your hand.'
            },
            {
                name: 'Gnaw',
                cost: [P],
                damage: 30,
                text: ''
            }];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Dedenne';
        this.fullName = 'Dedenne SSP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                if (selected) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: selected });
                }
            });
        }
        return state;
    }
}
exports.Dedenne = Dedenne;
