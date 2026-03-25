"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrakionEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TerrakionEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Rock Tumble',
                cost: [F, C],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
            {
                name: 'Pump-up Smash',
                cost: [F, F, C],
                damage: 90,
                text: 'Attach 2 basic Energy cards from your hand to your Benched Pokemon in any way you like.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Terrakion-EX';
        this.fullName = 'Terrakion-EX DRX';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Rock Tumble - ignore Resistance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        // Attack 2: Pump-up Smash - Attach 2 basic Energy from hand to bench
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasBasicEnergy = player.hand.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            if (!hasBasicEnergy) {
                return state;
            }
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            const availableCount = player.hand.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC).length;
            const count = Math.min(2, availableCount);
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: count, max: count }), transfers => {
                if (transfers) {
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.hand.moveCardTo(transfer.card, target);
                    }
                }
            });
        }
        return state;
    }
}
exports.TerrakionEx = TerrakionEx;
