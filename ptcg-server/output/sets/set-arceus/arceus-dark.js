"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusDark = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArceusDark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Prize Count',
                cost: [D, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If you have more Prize cards left than your opponent, this attack does 20 damage plus 60 more damage. '
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR1';
        this.name = 'Arceus';
        this.fullName = 'Arceus Dark AR';
    }
    reduceEffect(store, state, effect) {
        // Prize Count
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.getPrizeLeft() > effect.opponent.getPrizeLeft()) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.ArceusDark = ArceusDark;
