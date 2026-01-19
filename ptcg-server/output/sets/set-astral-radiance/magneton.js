"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardType = card_types_1.CardType.METAL;
        this.regulationMark = 'F';
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bounce Back',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Your opponent switches their Active Pokemon wtih 1 of their Benched Pokemon.'
            }];
        this.set = 'ASR';
        this.setNumber = '106';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magneton';
        this.fullName = 'Magneton ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        return state;
    }
}
exports.Magneton = Magneton;
