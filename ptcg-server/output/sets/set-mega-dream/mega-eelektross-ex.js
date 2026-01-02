"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaEelektrossex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaEelektrossex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = L;
        this.hp = 350;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Split Bomb',
                cost: [L, L],
                damage: 0,
                text: 'This attack does 60 damage to 2 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            },
            {
                name: 'Disaster Shock',
                cost: [L, L, L],
                damage: 190,
                text: 'You may discard 2 [L] Energy from this Pokemon. If you do, your opponent\'s Active Pokemon is now Paralyzed.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Eelektross ex';
        this.fullName = 'Mega Eelektross ex M2a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            // Split Bomb: 60 damage to 2 opponent's Pokemon
            // Don't apply Weakness and Resistance for Benched Pokemon
            prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(60, effect, store, state, 2, 2, false, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH]);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            // Disaster Shock: 190 damage, optionally discard 2 [L] Energy to Paralyze
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check how many Lightning energy cards are attached to this Pokemon
            const lightningEnergyCount = player.active.cards.filter(card => card instanceof game_1.EnergyCard && card.provides.includes(game_1.CardType.LIGHTNING)).length;
            // If player has at least 2 Lightning energy, offer to discard
            if (lightningEnergyCount >= 2) {
                return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], // Only from active Pokemon (this Pokemon)
                { superType: game_1.SuperType.ENERGY }, { min: 0, max: 2, allowCancel: false }), transfers => {
                    if (transfers === null || transfers.length === 0) {
                        // Player chose not to discard, just do damage
                        return state;
                    }
                    // Validate that all selected energy provides Lightning energy
                    const validLightningEnergy = transfers.filter(transfer => {
                        const energyCard = transfer.card;
                        return energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(game_1.CardType.LIGHTNING);
                    });
                    // Only proceed if exactly 2 Lightning energy were selected
                    if (validLightningEnergy.length === 2) {
                        // Discard the selected energy cards
                        for (const transfer of validLightningEnergy) {
                            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                            source.moveCardTo(transfer.card, player.discard);
                        }
                        // Apply Paralyzed status to opponent's Active Pokemon
                        const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.PARALYZED]);
                        specialConditionEffect.target = opponent.active;
                        store.reduceEffect(state, specialConditionEffect);
                    }
                    // If player selected less than 2 or non-Lightning energy, nothing happens (no discard, no paralysis)
                });
            }
        }
        return state;
    }
}
exports.MegaEelektrossex = MegaEelektrossex;
