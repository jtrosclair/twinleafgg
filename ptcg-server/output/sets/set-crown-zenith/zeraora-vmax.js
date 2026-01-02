"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeraoraVMAX = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ZeraoraVMAX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VMAX;
        this.evolvesFrom = 'Zeraora V';
        this.tags = [game_1.CardTag.POKEMON_VMAX];
        this.cardType = L;
        this.hp = 320;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Reactive Pulse',
                cost: [L, L],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each of your opponent\'s Pokémon in play that has an Ability.'
            },
            {
                name: 'Max Fist',
                cost: [L, L, C],
                damage: 240,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'CRZ';
        this.name = 'Zeraora VMAX';
        this.fullName = 'Zeraora VMAX CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let numOpPokemonWithAbilities = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (card.powers != null && card.powers.length > 0 && card.powers.some((power) => power.powerType == game_1.PowerType.ABILITY)) {
                    numOpPokemonWithAbilities++;
                }
            });
            const damagePerOpponent = 60;
            effect.damage = numOpPokemonWithAbilities * damagePerOpponent;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
        }
        return state;
    }
}
exports.ZeraoraVMAX = ZeraoraVMAX;
