"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Landorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Landorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Abundant Harvest',
                cost: [F],
                damage: 0,
                text: 'Attach a [F] Energy card from your discard pile to this Pokémon.'
            },
            {
                name: 'Gaia Hammer',
                cost: [F, F, C],
                damage: 80,
                text: 'Does 10 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Landorus';
        this.fullName = 'Landorus NVI';
    }
    reduceEffect(store, state, effect) {
        // Abundant Harvest - attach Fighting Energy from discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const fightingEnergy = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY &&
                c.energyType === card_types_1.EnergyType.BASIC &&
                c.name === 'Fighting Energy');
            if (fightingEnergy.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 1, allowCancel: true }), selected => {
                if (selected && selected.length > 0) {
                    player.discard.moveCardTo(selected[0], player.active);
                }
            });
        }
        // Gaia Hammer - 80 damage + 10 to all benched (both sides)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage opponent's bench
            opponent.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = benchSlot;
                    store.reduceEffect(state, damageEffect);
                }
            });
            // Damage player's own bench
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = benchSlot;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Landorus = Landorus;
