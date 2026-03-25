"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Muk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Gentle Wrap',
                cost: [P, C],
                damage: 20,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Toxic Secretion',
                cost: [P, C, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Muk';
        this.fullName = 'Muk NXD';
        this.GENTLE_WRAP_MARKER = 'GENTLE_WRAP_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Gentle Wrap - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.GENTLE_WRAP_MARKER, opponent.active, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, this.GENTLE_WRAP_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, this.GENTLE_WRAP_MARKER, this);
        // Toxic Secretion - double poison
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Add poison with double damage (2 counters = 20 damage per turn)
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.POISONED]);
            specialConditionEffect.poisonDamage = 20;
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Muk = Muk;
