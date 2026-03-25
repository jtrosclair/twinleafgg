"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Oblivion Wing',
                cost: [D],
                damage: 30,
                text: 'Attach a [D] Energy card from your discard pile to 1 of your Benched Pokémon.'
            },
            {
                name: 'Darkness Blade',
                cost: [D, D, C],
                damage: 100,
                text: 'Flip a coin. If tails, this Pokémon can\'t attack during your next turn.'
            }];
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal STS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.provides.includes(D);
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Darkness Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
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
            return state;
        }
        // Darkness Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (!result) {
                    const player = effect.player;
                    player.active.cannotAttackNextTurnPending = true;
                }
            });
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
