"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotasMunchlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RotasMunchlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Thick Fat',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Rota\'s Munchlax by attacks from [R] Pokémon and [W] Pokémon is reduced by 30 (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Rollout',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Rota\'s Munchlax';
        this.fullName = 'Rota\'s Munchlax PCGP';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER) || checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIRE)) {
                effect.damage -= 30;
            }
        }
        return state;
    }
}
exports.RotasMunchlax = RotasMunchlax;
