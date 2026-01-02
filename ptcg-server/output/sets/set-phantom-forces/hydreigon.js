"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hydreigon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Dark Impulse',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a [D] Energy card from your discard pile to your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Crazy Headbutt',
                cost: [P, D, C, C],
                damage: 130,
                text: 'Discard an Energy attached to this Pokémon.'
            }];
        this.set = 'PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon PHF';
        this.DARK_IMPULSE_MARKER = 'DARK_IMPULSE_MARKER';
        this.usedCrazyHeadbutt = false;
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DARK_IMPULSE_MARKER, this);
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.name === 'Darkness Energy';
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DARK_IMPULSE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, name: 'Darkness Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.DARK_IMPULSE_MARKER, this);
                prefabs_1.ABILITY_USED(player, this);
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
