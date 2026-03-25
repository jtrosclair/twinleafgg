"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysKomala = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LarrysKomala extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Lethargic Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is on your Bench, you may use this Ability. Attach an Energy card from your hand to your Active Larry\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Dozing Draw',
                cost: [C],
                damage: 0,
                text: 'This Pokémon is now Asleep. Draw 2 cards.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '175';
        this.name = 'Larry\'s Komala';
        this.fullName = 'Larry\'s Komala MC';
        this.LETHARGIC_CHARGE_MARKER = 'LETHARGIC_CHARGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Lethargic Charge ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if this Pokemon is on Bench
            let isOnBench = false;
            player.bench.forEach(benchSlot => {
                if (benchSlot.getPokemonCard() === this) {
                    isOnBench = true;
                }
            });
            if (!isOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.LETHARGIC_CHARGE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if player has Active Larry's Pokemon
            const activePokemon = player.active.getPokemonCard();
            if (!activePokemon || !activePokemon.name.startsWith('Larry\'s')) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length > 0) {
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.hand.moveCardTo(transfer.card, target);
                    }
                    player.marker.addMarker(this.LETHARGIC_CHARGE_MARKER, this);
                    (0, prefabs_1.ABILITY_USED)(player, this);
                }
            });
        }
        // Drowsy Draw attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Apply Asleep
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            specialConditionEffect.target = player.active;
            store.reduceEffect(state, specialConditionEffect);
            // Draw 2 cards
            (0, prefabs_1.DRAW_CARDS)(player, 2);
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.LETHARGIC_CHARGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.LETHARGIC_CHARGE_MARKER, this);
        }
        return state;
    }
}
exports.LarrysKomala = LarrysKomala;
