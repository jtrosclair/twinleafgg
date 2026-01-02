"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inteleon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Inteleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Drizzile';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bring Down',
                cost: [W],
                damage: 0,
                text: 'The Pokémon in play that has the least HP remaining, except for this Pokémon, is Knocked Out. (If there are multiple Pokémon, choose 1.)'
            },
            {
                name: 'Water Shot',
                cost: [W, W],
                damage: 110,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Inteleon';
        this.fullName = 'Inteleon M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let leastHP = 9999999999999999;
            // figuring out which pokemon actually has the least hp
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== player.active) {
                    const hpCheck = new check_effects_1.CheckHpEffect(player, card);
                    if (hpCheck.hp < leastHP) {
                        leastHP = hpCheck.hp;
                    }
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const hpCheck = new check_effects_1.CheckHpEffect(opponent, card);
                if (hpCheck.hp < leastHP) {
                    leastHP = hpCheck.hp;
                }
            });
            // making sure it gets put on the active pokemon
            if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
                if (effect.target !== effect.player.active) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
            }
            // eliminating the pokemon that don't have the least hp from being chosen
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const hpCheck = new check_effects_1.CheckHpEffect(player, list);
                if (list === player.active) {
                    blockedTo.push(target);
                }
                else if (hpCheck.hp !== leastHP) {
                    blockedTo.push(target);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const hpCheck = new check_effects_1.CheckHpEffect(opponent, list);
                if (hpCheck.hp !== leastHP) {
                    blockedTo.push(target);
                }
            });
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, blocked: blockedTo }), target => {
                const damageEffect = new game_effects_1.KnockOutEffect(player, target[0]);
                store.reduceEffect(state, damageEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Inteleon = Inteleon;
