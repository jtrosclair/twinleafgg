"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thwackey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Thwackey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.evolvesFrom = 'Grookey';
        this.powers = [{
                name: 'Lay of the Land',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If you have a Stadium in play, this Pokemon has no Retreat Cost.'
            }];
        this.attacks = [
            {
                name: 'Branch Poke',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SHF';
        this.name = 'Thwackey';
        this.fullName = 'Thwackey SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
    }
    reduceEffect(store, state, effect) {
        // Ability: Lay of the Land (passive - no retreat cost if any stadium is in play)
        // Ref: set-rebel-clash/cinderace-v.ts (Field Runner - CheckRetreatCostEffect + getStadiumCard)
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Any stadium in play (opponent's or player's) satisfies the condition
            if (game_1.StateUtils.getStadiumCard(state) !== undefined) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.Thwackey = Thwackey;
