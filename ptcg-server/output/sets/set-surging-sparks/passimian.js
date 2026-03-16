"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Passimian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Passimian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Coordinated Throwing',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each of your Basic Pokémon in play.'
            }
        ];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.regulationMark = 'H';
        this.name = 'Passimian';
        this.fullName = 'Passimian SSP';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let basicCount = 0;
            // Count active if Basic
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                basicCount++;
            }
            // Count benched Basic Pokemon
            player.bench.forEach(b => {
                var _a;
                if (b.cards.length > 0 && ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                    basicCount++;
                }
            });
            effect.damage = basicCount * 20;
        }
        return state;
    }
}
exports.Passimian = Passimian;
