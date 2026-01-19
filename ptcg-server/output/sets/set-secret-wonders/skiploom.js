"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skiploom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Skiploom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoppip';
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R, value: +20 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Cotton Balloon',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Skiploom has any [G] Energy attached to it, any damage done to Skiploom by attacks from your opponent\'s Evolved Pokémon is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'U-turn',
                cost: [G],
                damage: 20,
                text: 'Switch Skiploom with 1 of your Benched Pokémon.'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Skiploom';
        this.fullName = 'Skiploom SW';
        this.usedSmashTurn = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Check if there is any Water energy attached
            const hasGrassEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(card_types_1.CardType.GRASS) || energy.provides.includes(card_types_1.CardType.ANY));
            if (hasGrassEnergy && effect.source.getPokemons().length > 1) {
                effect.damage -= 20;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedSmashTurn = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSmashTurn) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            this.usedSmashTurn = false;
        }
        return state;
    }
}
exports.Skiploom = Skiploom;
