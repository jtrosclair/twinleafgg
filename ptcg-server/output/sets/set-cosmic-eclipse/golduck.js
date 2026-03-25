"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golduck = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golduck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Psyduck';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Energy Loop',
                cost: [W, C],
                damage: 80,
                text: 'Put an Energy attached to this Pokémon into your hand.'
            }];
        this.set = 'CEC';
        this.name = 'Golduck';
        this.fullName = 'Golduck CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: [card], sourceCard: this, sourceEffect: this.attacks[1] });
                return state;
            });
        }
        return state;
    }
}
exports.Golduck = Golduck;
