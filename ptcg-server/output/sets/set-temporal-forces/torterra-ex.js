"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torterraex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Torterraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grotle';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 340;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Forest March',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each [G] Pokémon you have in play.'
            },
            {
                name: 'Jungle Hammer',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Heal 50 damage from this Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Torterra ex';
        this.fullName = 'Torterra ex TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const playerBench = player.bench;
            let grassPokemon = 0;
            playerBench.forEach(c => {
                var _a;
                if (c.getPokemonCard() instanceof pokemon_card_1.PokemonCard) {
                    if (((_a = c.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) == card_types_1.CardType.GRASS) {
                        grassPokemon++;
                    }
                }
            });
            effect.damage = (grassPokemon + 1) * 30;
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        return state;
    }
}
exports.Torterraex = Torterraex;
