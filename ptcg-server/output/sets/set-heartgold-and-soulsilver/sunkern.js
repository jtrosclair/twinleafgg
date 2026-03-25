"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunkern = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sunkern extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cure Kernels',
                cost: [C],
                damage: 0,
                text: 'Remove 2 damage counters from 1 of your Pokémon.'
            },
            {
                name: 'Seed Bomb',
                cost: [G, C],
                damage: 20,
                text: ''
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Sunkern';
        this.fullName = 'Sunkern HS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            let hasPokemonWithDamage = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
                else {
                    hasPokemonWithDamage = true;
                }
            });
            if (hasPokemonWithDamage === false) {
                return state;
            }
            let targets = [];
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 20);
                    store.reduceEffect(state, healEffect);
                });
            });
        }
        return state;
    }
}
exports.Sunkern = Sunkern;
