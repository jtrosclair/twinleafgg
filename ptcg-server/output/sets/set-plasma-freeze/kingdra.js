"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kingdra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Seadra';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dragon Vortex',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of [W] Energy cards and [L] Energy cards in your discard pile. Then, shuffle all of those cards back into your deck.'
            },
            {
                name: 'Tri Bullet',
                cost: [W],
                damage: 0,
                text: 'This attack does 30 damage to 3 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kingdra';
        this.fullName = 'Kingdra PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Dragon Vortex
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Count [W] and [L] basic energy cards in discard
            const matchingEnergy = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY &&
                c.energyType === card_types_1.EnergyType.BASIC &&
                (c.provides.includes(card_types_1.CardType.WATER) || c.provides.includes(card_types_1.CardType.LIGHTNING)));
            effect.damage = 20 * matchingEnergy.length;
            // Shuffle all of those cards back into deck
            if (matchingEnergy.length > 0) {
                matchingEnergy.forEach(card => {
                    player.discard.moveCardTo(card, player.deck);
                });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            }
        }
        // Attack 2: Tri Bullet
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count available targets (active + bench with cards)
            let totalTargets = 1; // Active always counts
            opponent.bench.forEach(b => { if (b.cards.length > 0)
                totalTargets++; });
            const maxTargets = Math.min(3, totalTargets);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: maxTargets, max: maxTargets, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                targets.forEach(target => {
                    // For active: use DealDamageEffect (applies W/R)
                    // For bench: use PutDamageEffect (no W/R)
                    if (target === opponent.active) {
                        const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
                        dealDamage.target = target;
                        store.reduceEffect(state, dealDamage);
                    }
                    else {
                        const putDamage = new attack_effects_1.PutDamageEffect(effect, 30);
                        putDamage.target = target;
                        store.reduceEffect(state, putDamage);
                    }
                });
            });
        }
        return state;
    }
}
exports.Kingdra = Kingdra;
