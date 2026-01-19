"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: P, value: 30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Take Out',
                cost: [F],
                damage: 40,
                text: 'If the Defending Pokémon isn\'t an Evolved Pokémon, that Pokémon is Knocked Out instead of damaged by this attack.',
            },
            {
                name: 'Hurricane Punch',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 30 damage times the number of heads.',
            },
            {
                name: 'Rage',
                cost: [F, F, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 60 damage plus 10 more damage for each damage counter on Machamp.',
            },
        ];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Machamp';
        this.fullName = 'Machamp SF';
    }
    reduceEffect(store, state, effect) {
        // Take Out
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemons().length > 1) {
                return state;
            }
            effect.damage = 0;
            const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
        }
        // Hurricane Punch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 30 * heads;
            });
        }
        // Rage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            effect.damage += effect.player.active.damage;
        }
        return state;
    }
}
exports.Machamp = Machamp;
