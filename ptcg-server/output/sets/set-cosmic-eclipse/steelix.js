"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelix = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Steelix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.cardType = M;
        this.hp = 170;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Thumping Fall',
                cost: [C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Discard any number of Pokémon with a Retreat Cost of exactly 4 from your hand. This attack does 50 damage for each card you discarded in this way.',
            },
            {
                name: 'Iron Tail',
                cost: [M, C, C, C],
                damage: 100,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 100 damage for each heads.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Steelix';
        this.fullName = 'Steelix CEC';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const bigBoys = player.hand.cards.filter(c => c instanceof game_1.PokemonCard && c.retreat.length === 4);
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.retreat.length === 4) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.POKEMON }, { allowCancel: true, min: 0, max: bigBoys.length, blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
                const monsDiscarded = cards.length;
                effect.damage = monsDiscarded * 50;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    effect.damage = 100 * heads;
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.Steelix = Steelix;
