"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regirockex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regirockex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 230;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Regi Charge',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 Basic [F] Energy cards from your discard pile to this Pokemon.'
            },
            {
                name: 'Giant Rock',
                cost: [F, C, C, C],
                damage: 140,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokemon is a Stage 2 Pokemon, this attack does 140 more damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '101';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Regirock ex';
        this.fullName = 'Regirock ex DRI';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Regi Charge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if player has energy cards in discard pile
            const hasEnergy = player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fighting Energy');
            if (!hasEnergy) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 3, sameTarget: true }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Giant Rock
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2) {
                effect.damage += 140;
            }
        }
        return state;
    }
}
exports.Regirockex = Regirockex;
