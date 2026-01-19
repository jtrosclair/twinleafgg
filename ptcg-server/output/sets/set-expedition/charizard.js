"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Charizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Burning Energy',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may turn all basic Energy attached to all of your Pokémon into [R] Energy for the rest of the turn. This power can\'t be used if Charizard is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Scorching Whirlwind',
                cost: [R, R, R, R],
                damage: 120,
                text: 'Flip 2 coins. If 1 of them is tails, discard 2 Energy cards attached to Charizard. If both are tails, discard all Energy cards attached to Charizard.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Charizard';
        this.fullName = 'Charizard EX';
        this.BURNING_ENERGY_MARKER = 'BURNING_ENERGY_MARKER';
        this.BURNING_ENERGY_USED_MARKER = 'BURNING_ENERGY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.BURNING_ENERGY_USED_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.BURNING_ENERGY_USED_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            // Add the marker to all basic Energy cards attached to Pokémon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                cardList.cards.forEach(c => {
                    if (c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC) {
                        (0, prefabs_1.ADD_MARKER)(this.BURNING_ENERGY_MARKER, c, this);
                    }
                });
            });
        }
        // Change what affected Energy cards provide
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            effect.source.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && !effect.energyMap.some(e => e.card === c)) {
                    if ((0, prefabs_1.HAS_MARKER)(this.BURNING_ENERGY_MARKER, c, this)) {
                        effect.energyMap.push({ card: c, provides: [card_types_1.CardType.FIRE] });
                    }
                }
            });
            return state;
        }
        // Remove the markers at the end of the turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.forEach(c => {
                    if ((0, prefabs_1.HAS_MARKER)(this.BURNING_ENERGY_MARKER, c, this)) {
                        (0, prefabs_1.REMOVE_MARKER)(this.BURNING_ENERGY_MARKER, c, this);
                    }
                });
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.BURNING_ENERGY_USED_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                if (!heads) {
                    (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
                }
                if (heads === 1) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
                }
            });
        }
        return state;
    }
}
exports.Charizard = Charizard;
