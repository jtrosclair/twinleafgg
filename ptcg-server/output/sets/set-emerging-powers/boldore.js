"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boldore = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Boldore extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Roggenrola';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Smack Down',
                cost: [F, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has Fighting Resistance, this attack does 60 more damage.'
            },
            {
                name: 'Power Gem',
                cost: [F, F, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Boldore';
        this.fullName = 'Boldore EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingCard = opponent.active.getPokemonCard();
            if (defendingCard && defendingCard.resistance.some(r => r.type === card_types_1.CardType.FIGHTING)) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Boldore = Boldore;
