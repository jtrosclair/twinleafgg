"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dampening Shield',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'As long as this Pokémon is on your Bench, Pokémon in play (both yours and your opponent\'s) have no Weakness or Resistance.'
            }];
        this.attacks = [{
                name: 'Juggling',
                cost: [P, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 10 damage for each heads.'
            }];
        this.set = 'VS1';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime VS1';
    }
    reduceEffect(store, state, effect) {
        // Ability: Dampening Shield
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            let MrMimeOwner = null;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList === p.active) {
                        return;
                    }
                    if (cardList.getPokemonCard() === this) {
                        MrMimeOwner = p;
                    }
                });
            });
            if ((0, prefabs_1.IS_POKEMON_POWER_BLOCKED)(store, state, MrMimeOwner, this)) {
                return state;
            }
            if (!MrMimeOwner) {
                return state;
            }
            effect.weakness = [];
            effect.resistance = [];
        }
        // Attack 1: Juggling
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.MrMime = MrMime;
