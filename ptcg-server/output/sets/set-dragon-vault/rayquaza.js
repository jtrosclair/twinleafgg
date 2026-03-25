"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rayquaza = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rayquaza extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DRAGON }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dragon Pulse',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 40,
                text: 'Discard the top 2 cards of your deck.'
            },
            {
                name: 'Shred',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'This attack\'s damage isn\'t affected by any effects on ' +
                    'the Defending Pokemon.'
            }
        ];
        this.set = 'DRV';
        this.name = 'Rayquaza';
        this.fullName = 'Rayquaza DRV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 2);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 90);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Rayquaza = Rayquaza;
