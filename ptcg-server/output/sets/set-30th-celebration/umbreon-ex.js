"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Umbreonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Eevee';
        this.hp = 270;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Lunatic Claw',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: "If your opponent's Active Pokémon has any damage counters on it, this attack does 140 more damage.",
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Umbreon ex';
        this.fullName = 'Umbreon ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Lunatic Claw
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 140;
            }
        }
        return state;
    }
}
exports.Umbreonex = Umbreonex;
