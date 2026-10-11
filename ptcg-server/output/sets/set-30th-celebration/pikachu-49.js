"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu49 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #49 — Fighting Lightning */
class Pikachu49 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fighting Lightning',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: "If your opponent's Active Pokémon is a Pokémon ex, this attack does 80 more damage.",
            },
        ];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 49';
    }
    reduceEffect(store, state, effect) {
        // Fighting Lightning
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const defending = effect.opponent.active.getPokemonCard();
            if (defending === null || defending === void 0 ? void 0 : defending.tags.includes(game_1.CardTag.POKEMON_ex)) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Pikachu49 = Pikachu49;
