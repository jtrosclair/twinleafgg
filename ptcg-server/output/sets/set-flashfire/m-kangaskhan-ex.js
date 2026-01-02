"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MKangaskhanEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MKangaskhanEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.MEGA;
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.evolvesFrom = 'Kangaskhan-EX';
        this.cardType = C;
        this.hp = 230;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Wham Bam Punch',
                cost: [C, C, C],
                damage: 100,
                damageCalculation: '+',
                text: 'Flip a coin until you get tails. This attack does 30 more damage for each heads.'
            }];
        this.set = 'FLF';
        this.name = 'M Kangaskhan-EX';
        this.fullName = 'M Kangaskhan-EX FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof game_effects_1.EvolveEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tools.length > 0 && cardList.tools[0].name === 'Kangaskhan Spirit Link') {
                    return state;
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                    return state;
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    effect.damage += 30 * heads;
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.MKangaskhanEX = MKangaskhanEX;
