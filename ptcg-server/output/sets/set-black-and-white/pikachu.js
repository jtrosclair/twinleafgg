"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
class Pikachu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Energize',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for a [L] Energy card and attach it to this Pokémon.'
            },
            {
                name: 'Thunderbolt',
                cost: [L, L, C],
                damage: 80,
                text: 'Discard all Energy attached to this Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu BLW';
    }
    reduceEffect(store, state, effect) {
        // Energize - Search discard for Lightning Energy, attach to self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasLightningEnergyInDiscard = player.discard.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.LIGHTNING));
            if (!hasLightningEnergyInDiscard) {
                return state;
            }
            // Block attaching to anywhere except active
            const blockedTo = [];
            player.bench.forEach((_, index) => {
                blockedTo.push({
                    player: game_1.PlayerType.BOTTOM_PLAYER,
                    slot: game_1.SlotType.BENCH,
                    index
                });
            });
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: true, min: 0, max: 1, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Thunderbolt - Discard ALL Energy from self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const allEnergies = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            if (allEnergies.length > 0) {
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, allEnergies);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            }
        }
        return state;
    }
}
exports.Pikachu = Pikachu;
