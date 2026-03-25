"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goldeen = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Goldeen extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Festival Lead',
                powerType: game_1.PowerType.ABILITY,
                text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Whirlpool',
                cost: [C, C],
                damage: 10,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Goldeen';
        this.fullName = 'Goldeen TWM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
                    });
                }
            });
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                // Dynamically set barrage if Festival Grounds is in play
                const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
                    this.attacks[0].barrage = true;
                }
                else {
                    this.attacks[0].barrage = false;
                }
            }
        }
        return state;
    }
}
exports.Goldeen = Goldeen;
