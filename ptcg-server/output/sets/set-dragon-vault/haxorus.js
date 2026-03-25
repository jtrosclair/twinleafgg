"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haxorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Haxorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fraxure';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Axe Slugger',
                cost: [C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If the Defending Pok\u00e9mon is a Colorless Pok\u00e9mon, this attack does 60 more damage.'
            },
            {
                name: 'Dragon Pulse',
                cost: [F, M, C, C],
                damage: 100,
                text: 'Discard the top card of your deck.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '16';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Haxorus';
        this.fullName = 'Haxorus DRV';
    }
    reduceEffect(store, state, effect) {
        // Axe Slugger - +60 if defending is Colorless
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active.getPokemonCard();
            if (defendingPokemon && defendingPokemon.cardType === card_types_1.CardType.COLORLESS) {
                effect.damage += 60;
            }
        }
        // Dragon Pulse - discard top card of deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 1, this, effect.attack);
        }
        return state;
    }
}
exports.Haxorus = Haxorus;
