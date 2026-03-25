"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gyarados = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Gyarados extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magikarp';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L, value: +30 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Tail Revenge',
                cost: [],
                damage: 30,
                damageCalculation: 'x',
                text: 'Does 30 damage times the number of Magikarp in your discard pile.'
            },
            {
                name: 'Wreak Havoc',
                cost: [W, C],
                damage: 40,
                text: 'Flip a coin until you get tails. For each heads, discard the top card from your opponent\'s deck.'
            },
            {
                name: 'Dragon Beat',
                cost: [W, W, C, C, C],
                damage: 100,
                text: 'Flip a coin. If heads, discard an Energy card from each of your opponent\'s Pokémon.'
            }];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Gyarados';
        this.fullName = 'Gyarados SF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE)(30, c => c.name === 'Magikarp', effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: heads, sourceCard: this, sourceEffect: this.attacks[1] });
                    return state;
                });
            };
            return flipCoin();
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    let oppSpecialPokemon = 0;
                    let hasPokemonWithEnergy = false;
                    const blocked = [];
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                        if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                            hasPokemonWithEnergy = true;
                            oppSpecialPokemon++;
                        }
                        else {
                            blocked.push(target);
                        }
                    });
                    if (!hasPokemonWithEnergy) {
                        return state;
                    }
                    let targets = [];
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: oppSpecialPokemon, max: oppSpecialPokemon, allowCancel: false, blocked }), results => {
                        targets = results || [];
                    });
                    if (targets.length === 0) {
                        return state;
                    }
                    const target = targets[0];
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                    });
                    if (cards.length > 0) {
                        // Discard selected special energy card
                        cards.forEach(card => {
                            target.moveCardTo(card, opponent.discard);
                        });
                    }
                }
            });
        }
        return state;
    }
}
exports.Gyarados = Gyarados;
