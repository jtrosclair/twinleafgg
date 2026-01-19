"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servine = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Servine extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snivy';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Wrap',
                cost: [G],
                damage: 20,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }, {
                name: 'Vine Whip',
                cost: [G, C, C],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Servine';
        this.fullName = 'Servine SV11B';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_2.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_2.CoinFlipPrompt(player.id, game_2.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    // Defending Pokemon has no energy cards attached
                    if (!opponent.active.cards.some(c => c instanceof game_2.EnergyCard)) {
                        return state;
                    }
                    let cards = [];
                    return store.prompt(state, new game_2.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_2.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        return store.reduceEffect(state, discardEnergy);
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Servine = Servine;
