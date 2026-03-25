"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victini2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Victory Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, after you flip any coins for an attack, you may ignore all effects of those coin flips and begin flipping those coins again. You can\'t use more than 1 Victory Star Ability each turn.'
            }];
        this.attacks = [
            {
                name: 'Stored Power',
                cost: [R, C],
                damage: 30,
                text: 'Move all Energy attached to this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Victini';
        this.fullName = 'Victini NVI 14';
    }
    reduceEffect(store, state, effect) {
        // TODO: Implement Victory Star once coin-flip sequence rerolls are supported cleanly via CoinFlipEffect.
        // Attack: Stored Power
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            const attachedEnergies = player.active.cards.filter(card => {
                return card.superType === card_types_1.SuperType.ENERGY;
            });
            if (attachedEnergies.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length, sameTarget: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Victini2 = Victini2;
