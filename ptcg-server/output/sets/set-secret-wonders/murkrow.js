"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Murkrow = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Murkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 50;
        this.weakness = [{ type: L, value: +10 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dusk Stone',
                text: 'Murkrow can evolve during the turn you play it.',
                powerType: game_1.PowerType.HELD_ITEM
            }];
        this.attacks = [{
                name: 'Feint Attack',
                cost: [D, C],
                damage: 20,
                shredAttack: true,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
            }];
        this.set = 'SW';
        this.name = 'Murkrow';
        this.fullName = 'Murkrow SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.canEvolve = false;
        }
        // if (effect instanceof EvolveEffect && effect.target === this && state.turn === 2) {
        //   const player = effect.player;
        // }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            player.canEvolve = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.pokemonPlayedTurn = state.turn - 1;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                target.damage += 20;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 30);
                state = store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.Murkrow = Murkrow;
