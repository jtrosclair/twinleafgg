"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empoleon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Empoleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Prinplup';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L, value: +30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Dual Splash',
                cost: [W, C],
                damage: 0,
                text: 'Choose 2 of your opponent\'s Pokémon. This attack does 30 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Aqua Jet',
                cost: [W, W, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Does 50 damage plus 10 more damage for each of your Benched Pokémon. Flip a coin. If tails, this attack does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Empoleon';
        this.fullName = 'Empoleon MD';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentTargets = [opponent.active, ...opponent.bench].filter(p => p.cards.length > 0);
            const numTargets = opponentTargets.length;
            const minMax = numTargets >= 2 ? 2 : 1;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: minMax, max: minMax, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += playerBench * 10;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (!result) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                        if (cardList === player.active) {
                            return;
                        }
                        const damage = new attack_effects_1.PutDamageEffect(effect, 10);
                        damage.target = cardList;
                        store.reduceEffect(state, damage);
                    });
                }
            });
        }
        return state;
    }
}
exports.Empoleon = Empoleon;
