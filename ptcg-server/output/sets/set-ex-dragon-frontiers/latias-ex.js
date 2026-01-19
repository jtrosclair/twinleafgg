"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latiasex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Latiasex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES, card_types_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Fellow Boost',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may attach a basic Energy card from your hand to your Latias, Latias ex, Latios, or Latios ex. If you do, your turn ends. This power can\'t be used if Latias ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Power Crush',
                cost: [R, R, C],
                damage: 90,
                text: 'If the Defending Pokémon is Knocked Out by this attack, discard 2 [R] Energy attached to Latias ex.'
            }];
        this.set = 'DF';
        this.setNumber = '95';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latias ex';
        this.fullName = 'Latias ex DF';
        this.POWER_CRUSH_MARKER = 'POWER_CRUSH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.hand.cards.some(card => card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.name !== 'Latias' &&
                    card.name !== 'Latias ex' &&
                    card.name !== 'Latios' &&
                    card.name !== 'Latios ex') {
                    blockedTo.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, blockedTo }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.POWER_CRUSH_MARKER, effect.opponent.active, this);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && (0, prefabs_1.HAS_MARKER)(this.POWER_CRUSH_MARKER, effect.target, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const attackEffect = new game_effects_1.AttackEffect(opponent, player, this.attacks[0]);
            attackEffect.preventDefault = true;
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, attackEffect, 2, card_types_1.CardType.FIRE);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.POWER_CRUSH_MARKER, this);
        return state;
    }
}
exports.Latiasex = Latiasex;
