"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parasect = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Parasect extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Paras';
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Allergic Pollen',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'As long as Parasect is in play, cards in any player\'s discard piles are not affected by attacks or Pokémon Powers.This power stops working if Parasect becomes Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Sleep Pinchers',
                cost: [G, G],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            }];
        this.set = 'N3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Parasect';
        this.fullName = 'Parasect N3';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.MoveCardsEffect) {
            let isParasectInPlay = false;
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.ANY, (list, card) => {
                    if (card === this) {
                        if ((0, prefabs_1.IS_POKEMON_POWER_BLOCKED)(store, state, player, this)) {
                            return;
                        }
                        if (player.active.getPokemonCard() === this &&
                            player.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                            player.active.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                            player.active.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                            return;
                        }
                        isParasectInPlay = true;
                    }
                });
            });
            if (!isParasectInPlay) {
                return state;
            }
            if (effect.sourceEffect.powerType === game_1.PowerType.POKEMON_POWER ||
                effect.sourceEffect.powerType === game_1.PowerType.POKEPOWER ||
                effect.sourceEffect.powerType === game_1.PowerType.POKEBODY ||
                ((_a = effect.sourceCard) === null || _a === void 0 ? void 0 : _a.attacks.some(attack => attack.name === effect.sourceEffect.name))) {
                // Check if the source is in the discard pile of any player
                if (state.players.some(player => effect.source === player.discard)) {
                    effect.preventDefault = true;
                    return state;
                }
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_2.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
                    addSpecialCondition.target = opponent.active;
                    store.reduceEffect(state, addSpecialCondition);
                }
            });
        }
        return state;
    }
}
exports.Parasect = Parasect;
