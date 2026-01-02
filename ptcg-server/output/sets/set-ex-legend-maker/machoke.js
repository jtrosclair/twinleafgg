"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Paranoid',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Machoke is Confused, Machoke\'s attacks do 50 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Split Kick',
                cost: [F],
                damage: 0,
                text: 'Does 20 damage to each Defending Pokémon.'
            },
            {
                name: 'Magnum Punch',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Machoke';
        this.fullName = 'Machoke LM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (player.active.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED)) {
                effect.damage += 50;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage = 20;
        }
        return state;
    }
}
exports.Machoke = Machoke;
