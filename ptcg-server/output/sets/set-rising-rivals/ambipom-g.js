"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbipomG = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class AmbipomG extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tail Code',
                cost: [C],
                damage: 0,
                text: 'Move an Energy card attached to the Defending Pokémon to another of your opponent\'s Pokémon.'
            },
            {
                name: 'Snap Attack',
                cost: [C, C],
                damage: 60,
                text: 'If the Defending Pokémon has any Energy cards attached to it, this attack\'s base damage is 20 instead of 60.'
            }
        ];
        this.set = 'RR';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ambipom G';
        this.fullName = 'Ambipom G RR';
    }
    reduceEffect(store, state, effect) {
        // Jamming Wave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    if (!opponent.bench.some(b => b.cards.length > 0)) {
                        return state;
                    }
                    let energyCount = 0;
                    opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        const hasEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                        store.reduceEffect(state, hasEnergy);
                        if (hasEnergy.energyMap.length > 0) {
                            energyCount += hasEnergy.energyMap.length;
                        }
                    });
                    if (energyCount === 0) {
                        return state;
                    }
                    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, opponent.active.energies, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, opponent, transfer.to);
                            opponent.active.moveCardTo(transfer.card, target);
                        }
                    });
                }
            });
        }
        // Snap Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const opponentActive = opponent.active;
            const hasEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponentActive);
            store.reduceEffect(state, hasEnergy);
            if (hasEnergy.energyMap.length > 0) {
                effect.damage = 20;
            }
        }
        return state;
    }
}
exports.AmbipomG = AmbipomG;
