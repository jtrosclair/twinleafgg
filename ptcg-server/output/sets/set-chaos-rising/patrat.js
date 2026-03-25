"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patrat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Patrat extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = C;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Watchful Eyes',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokemon is in play, you and your opponent can\'t move damage counters to another Pokemon.'
            }];
        this.attacks = [{
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Patrat';
        this.fullName = 'Patrat M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.MoveDamageCountersEffect) {
            let hasPatrat = false;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if ((card === null || card === void 0 ? void 0 : card.name) === 'Patrat')
                        hasPatrat = true;
                });
            });
            if (hasPatrat) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Patrat = Patrat;
