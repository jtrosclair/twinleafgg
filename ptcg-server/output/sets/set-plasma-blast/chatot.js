"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatot = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Chatot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Misinformation',
                cost: [C],
                damage: 0,
                text: 'Discard all Pok\u00e9mon Tool cards attached to each of your opponent\'s Pok\u00e9mon.'
            },
            {
                name: 'Tone-Deaf',
                cost: [C, C],
                damage: 20,
                text: 'The Defending Pok\u00e9mon is now Confused.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chatot';
        this.fullName = 'Chatot PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const tools = cardList.tools.slice();
                tools.forEach(tool => {
                    cardList.moveCardTo(tool, opponent.discard);
                });
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Chatot = Chatot;
