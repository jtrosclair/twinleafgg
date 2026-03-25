"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = N;
        this.hp = 100;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Tail Whip',
                cost: [C],
                damage: 20,
                text: ''
            }, {
                name: 'Destructive Whirlpool',
                cost: [W, L, C, C],
                damage: 70,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                return store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Dragonair = Dragonair;
