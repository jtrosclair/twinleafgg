"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Druddigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Druddigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 120;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Revenge',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER],
                damage: 40,
                text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 120 more damage.'
            },
            {
                name: 'Dragon Claw',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'BRS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Druddigon';
        this.fullName = 'Druddigon BRS';
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 120;
            }
            return state;
        }
        // if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
        //   effect.target.tools.includes(this)) {
        //   const player = StateUtils.getOpponent(state, effect.player);
        //   if (player.active.tools.includes(this)) {
        //     this.damageDealt = true;
        //   }
        // }
        return state;
    }
}
exports.Druddigon = Druddigon;
