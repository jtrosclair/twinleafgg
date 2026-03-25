"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octillery = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Octillery extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Remoraid';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sharpshooting',
                cost: [W],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Pok\u00e9mon. (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
            },
            {
                name: 'Bubble Beam',
                cost: [W, W],
                damage: 40,
                text: 'Flip a coin. If heads, the Defending Pok\u00e9mon is now Paralyzed.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Octillery';
        this.fullName = 'Octillery PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Octillery = Octillery;
