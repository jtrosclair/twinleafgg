"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Oricorio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lesson in Zeal',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'All of your Fusion Strike Pokémon take 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). You can\'t apply more than 1 Lesson in Zeal Ability at a time.'
            }];
        this.attacks = [{
                name: 'Glistening Droplets',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 5 damage counters on your opponent\'s Pokémon in ' +
                    'any way you like.'
            }];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Oricorio';
        this.fullName = 'Oricorio FST';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_2.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(5, store, state, effect);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && state_utils_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const player = effect.player;
            const target = effect.target.getPokemonCard();
            const isTargetFusionStrike = target && target.tags.includes(card_types_1.CardTag.FUSION_STRIKE);
            if (isTargetFusionStrike) {
                if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                    return state;
                }
                effect.reduceDamage(20, this.powers[0].name);
            }
            return state;
        }
        return state;
    }
}
exports.Oricorio = Oricorio;
