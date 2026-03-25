"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolgaleoPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SolgaleoPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Radiant Star',
                cost: [M],
                damage: 0,
                text: 'For each of your opponent\'s Pokémon in play, attach a [M] Energy card from your discard pile to your Pokémon in any way you like.'
            },
            {
                name: 'Corona Impact',
                cost: [M, M, M, M],
                damage: 160,
                text: 'This Pokémon can\'t attack during your next turn.'
            }];
        this.set = 'UPR';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Solgaleo Prism Star';
        this.fullName = 'Solgaleo Prism Star FLI';
    }
    reduceEffect(store, state, effect) {
        // Radiant Star
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.name === 'Metal Energy';
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (benched === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: benched }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Corona Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.SolgaleoPrismStar = SolgaleoPrismStar;
