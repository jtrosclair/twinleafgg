"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terrakion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Terrakion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{
                type: card_types_1.CardType.GRASS
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Retaliate',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If any of your Pokemon were Knocked Out by damage from an opponent\'s ' +
                    'attack during his or her last turn, this attack does 60 more damage.'
            }, {
                name: 'Land Crush',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.set = 'NVI';
        this.name = 'Terrakion';
        this.fullName = 'Terrakion NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 60;
            }
            return state;
        }
        return state;
    }
}
exports.Terrakion = Terrakion;
