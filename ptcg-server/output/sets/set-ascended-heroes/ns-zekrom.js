"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsZekrom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NsZekrom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.NS];
        this.cardType = N;
        this.hp = 130;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Shred',
                cost: [C, C, C],
                damage: 70,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Rampaging Thunder',
                cost: [R, L, L, C],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t use attacks.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.name = 'N\'s Zekrom';
        this.fullName = 'N\'s Zekrom M2a';
    }
    reduceEffect(store, state, effect) {
        // Shred
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 70);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, damage);
                state = store.reduceEffect(state, dealDamage);
            }
        }
        // Rampage Thunder
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.NsZekrom = NsZekrom;
