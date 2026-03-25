"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blazikenex = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blazikenex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Combusken';
        this.cardType = R;
        this.hp = 320;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Seething Spirit',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a Basic Energy card from your discard pile to 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Burning Assault',
                cost: [R, C],
                damage: 200,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Blaziken ex';
        this.fullName = 'Blaziken ex JTG';
        this.OVERFLOWING_SPIRIT_MARKER = 'OVERFLOWING_SPIRIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.OVERFLOWING_SPIRIT_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === game_1.SuperType.ENERGY
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.OVERFLOWING_SPIRIT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.OVERFLOWING_SPIRIT_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                    }
                });
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
        // Burning Assault
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Blazikenex = Blazikenex;
