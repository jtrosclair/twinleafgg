"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camerupt = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Camerupt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Numel';
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Burn Roast',
                cost: [R],
                damage: 110,
                text: 'If your opponent\'s Active Pokémon isn\'t Burned, this attack does nothing.'
            },
            {
                name: 'Power Stomp',
                cost: [R, C, C, C],
                damage: 170,
                text: 'Discard 2 Energy from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Camerupt';
        this.fullName = 'Camerupt M2a';
    }
    reduceEffect(store, state, effect) {
        // Burn Roast
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const activePokemon = opponent.active;
            // Check if opponent's active Pokémon is not burned
            if (!activePokemon.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                effect.damage = 0;
            }
        }
        // Power Stomp
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            // Check if this Pokémon has at least 2 energy attached
            const energyCount = player.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY).length;
            if (energyCount >= 2) {
                state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2 }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        source.moveCardTo(transfer.card, player.discard);
                    }
                });
            }
        }
        return state;
    }
}
exports.Camerupt = Camerupt;
