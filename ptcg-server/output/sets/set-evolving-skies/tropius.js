"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tropius = void 0;
const game_1 = require("../../game");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tropius extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rally Back',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
            },
            {
                name: 'Solar Beam',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Tropius';
        this.fullName = 'Tropius EVS';
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 90;
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
exports.Tropius = Tropius;
