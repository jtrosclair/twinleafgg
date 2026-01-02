"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Samurott = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_2 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useNightGate(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_2.StateUtils.getOpponent(state, player);
    const playerHasBench = player.bench.some(b => b.cards.length > 0);
    const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
    if (playerHasBench === false) {
        throw new game_1.GameError(game_2.GameMessage.CANNOT_USE_POWER);
    }
    if (opponentHasBench === false) {
        return state;
    }
    if (playerHasBench && opponentHasBench) {
        // First, opponent switches
        return store.prompt(state, new game_2.ChoosePokemonPrompt(player.id, game_2.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_2.PlayerType.BOTTOM_PLAYER, [game_2.SlotType.BENCH], { allowCancel: false }), results => {
            if (results && results.length > 0) {
                player.active.clearEffects();
                player.switchPokemon(results[0]);
                // Then player switches
                return store.prompt(state, new game_2.ChoosePokemonPrompt(opponent.id, game_2.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_2.PlayerType.BOTTOM_PLAYER, [game_2.SlotType.BENCH], { allowCancel: false }), playerResults => {
                    if (playerResults && playerResults.length > 0) {
                        opponent.active.clearEffects();
                        opponent.switchPokemon(playerResults[0]);
                    }
                    return state;
                });
            }
            return state;
        });
    }
}
class Samurott extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dewott';
        this.cardType = W;
        this.hp = 160;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Strong Currents',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokemon. If you do, your opponent switches their Active Pokemon with 1 of their Benched Pokemon.'
            }];
        this.attacks = [{
                name: 'Energy Slash',
                cost: [W],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Energy attached to this Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Samurott';
        this.fullName = 'Samurott SV11W';
        this.STRONG_CURRENTS_MARKER = 'STRONG_CURRENTS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Remove marker on end turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.STRONG_CURRENTS_MARKER, this)) {
            effect.player.marker.removeMarker(this.STRONG_CURRENTS_MARKER, this);
        }
        // Strong Currents ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useNightGate(() => generator.next(), store, state, effect);
            const player = effect.player;
            if (player.marker.hasMarker(this.STRONG_CURRENTS_MARKER, this)) {
                throw new game_1.GameError(game_2.GameMessage.POWER_ALREADY_USED);
            }
            effect.player.marker.addMarker(this.STRONG_CURRENTS_MARKER, this);
            player.forEachPokemon(game_2.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                }
            });
            return generator.next().value;
        }
        // Energy Slash attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergy);
            const energyCount = checkProvidedEnergy.energyMap.length;
            effect.damage = 30 + (50 * energyCount);
        }
        return state;
    }
}
exports.Samurott = Samurott;
