"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatiasStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LatiasStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STAR];
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: P, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Healing Light',
                cost: [C],
                damage: 10,
                text: 'Remove 1 damage counter from each of your Pokémon (including Latias Star).'
            },
            {
                name: 'Shooting Star',
                cost: [R, W, P],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Pokémon-ex, discard all Energy cards attached to Latias Star and this attack does 50 damage plus 100 more damage.'
            }
        ];
        this.set = 'DX';
        this.name = 'Latias Star';
        this.fullName = 'Latias Star DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 10);
                healTargetEffect.target = cardList;
                state = store.reduceEffect(state, healTargetEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            const defending = opponent.active;
            if ((_a = defending.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.LatiasStar = LatiasStar;
