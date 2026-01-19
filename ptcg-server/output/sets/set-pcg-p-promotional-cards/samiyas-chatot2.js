"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamiyasChatot2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SamiyasChatot2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Oblivious',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Samiya\'s Chatot by attacks from your opponent\'s Evolved Pokémon is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Claw',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.name = 'Samiya\'s Chatot';
        this.fullName = 'Samiya\'s Chatot PCGP 152';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            if (effect.source.getPokemons().length > 1) {
                effect.damage -= 20;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.SamiyasChatot2 = SamiyasChatot2;
