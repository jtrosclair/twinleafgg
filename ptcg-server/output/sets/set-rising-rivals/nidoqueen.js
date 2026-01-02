"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoqueen = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidoqueen extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorina';
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: P, value: +30 }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Maternal Comfort',
                powerType: game_1.PowerType.POKEBODY,
                text: 'At any times between turns, remove 1 damage counter from each of your Pokémon. You can\'t use more than 1 Maternal Comfort Poké-Body between turns.'
            }];
        this.attacks = [{
                name: 'Mega Punch',
                cost: [P],
                damage: 40,
                text: ''
            },
            {
                name: 'Ruthless Tail',
                cost: [P, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Does 50 damage plus 10 more damage for each of your opponent\'s Benched Pokémon.'
            }];
        this.set = 'RR';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nidoqueen';
        this.fullName = 'Nidoqueen RR';
    }
    reduceEffect(store, state, effect) {
        // Handle Maternal Comfort Poké-Body
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && !effect.maternalComfortUsed) {
            const player = effect.player;
            let isNidoqueenInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isNidoqueenInPlay = true;
                }
            });
            if (!isNidoqueenInPlay) {
                return state;
            }
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            effect.maternalComfortUsed = true;
            player.forEachPokemon(game_1.PlayerType.ANY, cardList => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += 10 * opponentBench;
        }
        return state;
    }
}
exports.Nidoqueen = Nidoqueen;
