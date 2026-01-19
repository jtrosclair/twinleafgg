"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Mew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Psywave',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Devolution Beam',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, choose 1 of either player\'s Evolved Pokémon, remove the highest stage Evolution card from that Pokémon, and put it into that player\'s hand.'
            }];
        this.set = 'NP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Mew';
        this.fullName = 'Mew NP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            store.reduceEffect(state, checkProvidedEnergy);
            const damagePerEnergy = 10;
            effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    let canDevolve = false;
                    const blocked = [];
                    effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                        if (list.getPokemons().length > 1) {
                            canDevolve = true;
                        }
                        else {
                            blocked.push(target);
                        }
                    });
                    effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                        if (list.getPokemons().length > 1) {
                            canDevolve = true;
                        }
                        else {
                            blocked.push(target);
                        }
                    });
                    if (!canDevolve) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1, blocked }), (results) => {
                        if (results && results.length > 0) {
                            (0, prefabs_1.DEVOLVE_POKEMON)(store, state, results[0], effect.opponent.hand);
                        }
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Mew = Mew;
