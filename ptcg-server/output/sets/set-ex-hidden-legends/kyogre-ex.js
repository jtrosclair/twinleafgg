"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyogreex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kyogreex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Mark of Antiquity',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Kyogre ex is your Active Pokémon, each player\'s Groudon ex and Rayquaza ex can\'t attack.'
            }];
        this.attacks = [{
                name: 'Water Arrow',
                cost: [C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Super Tidal Wave',
                cost: [W, W, C],
                damage: 50,
                damageCalculation: '+',
                text: 'You may show your hand to your opponent. If you do, this attack does 50 damage plus 10 more damage for each Energy card in your hand. After doing damage, shuffle the Energy cards back into your deck.'
            }];
        this.set = 'HL';
        this.setNumber = '94';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyogre ex';
        this.fullName = 'Kyogre ex HL';
        this.usedSTW = false;
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.AttackEffect && (((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Groudon ex' || ((_b = effect.source.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) === 'Rayquaza ex')) {
            if (effect.opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(20, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, player.hand.cards);
                    const energyCards = player.hand.cards.filter(card => card.superType === game_1.SuperType.ENERGY);
                    effect.damage += 10 * energyCards.length;
                    this.usedSTW = true;
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        // doing this after so that the energy are in hand when they are shown to the opponent
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSTW === true) {
            const player = effect.player;
            const energyCards = player.hand.cards.filter(card => card.superType === game_1.SuperType.ENERGY);
            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: energyCards, sourceCard: this, sourceEffect: this.attacks[1] });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            this.usedSTW = false;
        }
        return state;
    }
}
exports.Kyogreex = Kyogreex;
