"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Sinister Fog',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 1 damage counter on each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Creep Show',
                cost: [P, C],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon has 3 or more damage counters on it, that Pokémon is Knocked Out.'
            },
        ];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Gengar';
        this.fullName = 'Gengar BKT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(__1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList !== opponent.active) {
                    const countersEffect = new attack_effects_1.PutCountersEffect(effect, 10);
                    countersEffect.target = cardList;
                    store.reduceEffect(state, countersEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage >= 30) {
                opponent.active.damage += 999;
            }
        }
        return state;
    }
}
exports.Gengar = Gengar;
